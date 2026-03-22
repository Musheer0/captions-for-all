import modal
from pydantic import BaseModel
from collections import OrderedDict
from typing import TypedDict, Any
import sys
import traceback
import uuid
print("VERSION 3")
image =  modal.Image.debian_slim(python_version="3.10").apt_install(
    "ffmpeg",
    "wget",
    "fontconfig",
    "fonts-noto", #noto
    "fonts-noto-cjk", #chinease/japanese/korean
    "fonts-noto-color-emoji"
    
    ).run_commands(
    "fc-cache -fv",
    "fc-list | grep -i noto || true"    #log
    ).uv_pip_install(
    "whisperx==3.8.2",
    "fastapi[standard]==0.124.4",
    "peft==0.18.0",
    "uuid"
).add_local_dir('.','/root',copy=True)


app = modal.App("c4f", image=image)
s3_BUCKET_NAME = "11labs"
s3_MOUNT_PATH = "/s3"
s3_bucket = modal.CloudBucketMount(
    s3_BUCKET_NAME,
    bucket_endpoint_url="https://t3.storage.dev",
    secret=modal.Secret.from_name("cloudflare-r2"),
)

MAX_ALIGN_MODELS = 6
with image.imports():
    import io
    import os
    import json
    from pathlib import Path
    from fastapi import Depends, FastAPI, HTTPException, Security
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.security import APIKeyHeader
    from libs.srt_utils import  format_to_words_srt,seconds_to_srt_time,words_to_srt
    from libs.schemas import BurnCaptionResponse,ProcessVideoRequest,SrtSegment,ExtractCaptionResponse,ExtractCaptionResult,BurnCaptionToVideo
    from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
    from fastapi import Depends
    import subprocess
    import gc
    import whisperx
    import shutil
    from libs.burn_captions import burn_caption_to_video, soft_burn_caption_to_video
    from libs.srt_utils import format_to_words_srt,words_to_srt
    from libs.translate_captions import translate_captions
    api_key_schema = APIKeyHeader(
        name='x-internal-key',
        scheme_name="ApiKeyAuth",
        auto_error=False
    )

    def verify_api_key(x_api_key: str | None = Security(api_key_schema)):
        expected = os.environ.get("API_KEY")
        if not expected or x_api_key != expected:
            raise HTTPException(status_code=403, detail="Invalid Api Key")


    
    def write_srt(words, output_path):
        srt_content = words_to_srt(words)
        path:Path = Path(s3_MOUNT_PATH) / output_path
        path.write_text(srt_content)
    def burn_captions(request:BurnCaptionToVideo,soft: bool):
            video_path = Path(s3_MOUNT_PATH)/request.video_key
            output_path =  f"{request.video_key}-{request.lang_code}.{'mkv' if soft else 'mp4'}"
            s3_output_path = Path(s3_MOUNT_PATH)/ f"{request.video_key}-{request.lang_code}.mp4"
            temp_output_path =f"{uuid.uuid4().hex}-{request.video_id}-{request.lang_code}.{'mkv' if soft else 'mp4'}"
            srt_path = Path(s3_MOUNT_PATH)/(request.video_key+f"-{request.lang_code}.srt")
            lang = request.lang_code
            
            #step 1.1  check if  already generated
            if s3_output_path.exists():
                return output_path, lang, True
            if not video_path.exists():
                raise HTTPException(status_code=400, detail="Video Not found")
            
            #step 2 create srt file if not exists
            if not srt_path.exists():
                
                #step 2 if no existing srt
                caption_path = Path(s3_MOUNT_PATH) / request.caption_key
                if not caption_path.exists():
                    raise HTTPException(status_code=400, detail="Captions not found ")
                
                #step 3 format caption
                captions_json = None
                print("LOADING CAPTIONS_------------------------------------------")
                with open(caption_path) as f:
                    captions_json = json.load(f)
                if caption_path==None:
                    raise HTTPException(status_code=400, detail="Error loading caption file")
                lang  =captions_json["language"]
                captions = captions_json["srt"]
                if request.lang_code=="og":
                    lang = captions_json["language"]
                if  request.lang_code!=lang:
                    print("TRANSLATING CAPTIONS---------------------------------")
                    captions = translate_captions(captions,request.lang_code,lang)
                    lang = request.lang_code
                #step 4 save srt 
                print("SAVING SRT --------------------------------")
                write_srt(captions,str(srt_path))
           
           #step 5 burn caption
            print("BURNING CAPTIONS ---------------------------------")
            burned_video = (
            soft_burn_caption_to_video(srt_path, video_path, request.lang_code, temp_output_path)
            if soft
            else burn_caption_to_video(srt_path, video_path, request.lang_code, temp_output_path)
            )
            print("SAVING CAPTIONS-------------------------------------------------")
            shutil.copy(temp_output_path,str(s3_output_path))
            if os.path.exists(burned_video):
                os.remove(burned_video)
            print("DONE _____________________")
            return output_path, lang,False
@app.cls(
    gpu="L40S",
    scaledown_window=60 * 5,
    secrets=[
        modal.Secret.from_name("cloudflare-r2"),
        modal.Secret.from_name("API_KEY"),
    ],
    volumes={s3_MOUNT_PATH: s3_bucket}, 
    timeout=60*60
)
@modal.concurrent(max_inputs=10 )
class CFA:
    def get_align_model(self, lang: str):
        if lang in self.align_models:
            self.align_models.move_to_end(lang)
            return self.align_models[lang]
        model, metadata = whisperx.load_align_model(
            language_code=lang,
            device="cuda"
        )
        self.align_models[lang] = (model, metadata)
        if len(self.align_models) > MAX_ALIGN_MODELS:
            self.align_models.popitem(last=False)  # Remove oldest (front of OrderedDict)
        return model, metadata

    @modal.enter()
    def load_modal(self): 
        device = "cuda"
        self.device= device
        batch_size = 16
        self.batch_size = batch_size
        compute_type = "float16"
        self.align_models = OrderedDict()
        self.model = whisperx.load_model("large-v2", device, compute_type=compute_type)
        self.eng_align_model, self.eng_align_metadata = whisperx.load_align_model(
            language_code="en",  # whisperx uses ISO 639-1 ("en")
            device=device
        )
    @modal.asgi_app()
    def serve(self):
        web_app = FastAPI(
            title="Captions4All",
            docs_url="/docs",
            dependencies=[Depends(verify_api_key)]
        )
        web_app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

        @web_app.post("/extract-caption",response_model=ExtractCaptionResponse)
        def process_video(request: ProcessVideoRequest):
            video_path = Path(s3_MOUNT_PATH) / request.video_key
            if not video_path.exists():
                raise HTTPException(status_code=400, detail="Video Not found")

            try:
                # Load audio
                print("LOADING AUDIO----------------------------------------------------")
                audio = whisperx.load_audio(str(video_path))
                print("TRANSCRIING AUDIO_------------------------------------------")
                raw_transcript = self.model.transcribe(audio, batch_size=self.batch_size)
                lang = raw_transcript["language"]
                aligned_transcript = None
                print("ALIGNING AUDIO_------------------------------------------")
                if lang == "en":
                    aligned_transcript = whisperx.align(
                        raw_transcript["segments"],
                        self.eng_align_model,
                        self.eng_align_metadata,
                        audio,
                        self.device,
                        return_char_alignments=False,
                    )
                else:
                    align_model, align_metadata = self.get_align_model(lang)
                    aligned_transcript = whisperx.align(
                        raw_transcript["segments"],
                        align_model,
                        align_metadata,
                        audio,
                        self.device,
                        return_char_alignments=False,
                    )
                print("ALIGNED AUDIO_------------------------------------------")

                result = {
                    "language": lang,
                    "raw_segments": raw_transcript["segments"],
                    "srt": [],
                }

                for segment in aligned_transcript["segments"]:
                    result["srt"].extend(format_to_words_srt(segment.get("words", [])))
# The line `print("UPLOAD AUDIO TRANSCRIBE_------------------------------------------")` is a print
# statement in Python that outputs the message "UPLOAD AUDIO
# TRANSCRIBE_------------------------------------------" to the console when the code is executed.
# This print statement is used as a debugging or informational message to indicate a specific point in
# the code execution flow.
                print("UPLOAD AUDIO TRANSCRIBE_------------------------------------------")

                # Upload result JSON to S3 with same key but .json extension
                json_key = str(Path(request.video_key).with_suffix(".json"))
                json_path = Path(s3_MOUNT_PATH) / json_key
                json_path.parent.mkdir(parents=True, exist_ok=True)

                with open(json_path, "w", encoding="utf-8") as f:
                    json.dump(result, f, ensure_ascii=False)
                print("ALL DONE_------------------------------------------")

                return {
                    "result_key": json_key,
                    "language": lang,
                }

            except HTTPException:
                raise
            except Exception as e:
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to process video: {e}",
                )
        
        @web_app.post('/burn-captions',response_model=BurnCaptionResponse)
        def hard_burn_captions(request:BurnCaptionToVideo):
            output_path, lang ,cached= burn_captions(request,soft=False)
            return {"success":True, "output_path":str(output_path), "lang":lang,"cached": cached,}
        @web_app.post('/soft-burn-captions',response_model=BurnCaptionResponse)
        def soft_burn_captions(request:BurnCaptionToVideo):
          output_path, lang,cached = burn_captions(request,soft=True)
          return {"success":True, "output_path":str(output_path), "lang":request.lang_code,"cached": cached,}
        
        return web_app