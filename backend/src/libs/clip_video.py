from libs.extract_clips_trabscribe import clip_transcribe_gemini
from pathlib import Path
import subprocess
import uuid
from pydantic import BaseModel, field_validator


class TempClip(BaseModel):
    path: str
    title: str
    start: float
    end: float

    @field_validator("end")
    @classmethod
    def validate_time(cls, v, info):
        start = info.data.get("start")
        if start is not None and v <= start:
            raise ValueError("end must be greater than start")
        return v


def extract_clips_from_video(
    srt: list,
    clips_count: int,
    video_path: str,
    video_id: str
):
    print("clipping transcribe-----------------------------------")
    clips = clip_transcribe_gemini(srt, clips=clips_count)
    print("clipped transcribe-----------------------------------")
    output_dir = Path("clips")
    output_dir.mkdir(exist_ok=True)

    temp_paths: list[TempClip] = []

    for clip in clips.clips:
        try:
            #  validate BEFORE ffmpeg
            print("clipping video", clip)
            valid_clip = TempClip(
                path="",
                title=clip.title,
                start=float(clip.start),
                end=float(clip.end)
            )
        except Exception as e:
            print("Invalid clip skipped:", e)
            continue

        output_file = output_dir / f"{uuid.uuid4().hex}-{video_id}.mp4"

        cmd = [
            "ffmpeg",
            "-y",
            "-loglevel", "error",
            "-ss", str(valid_clip.start),
            "-to", str(valid_clip.end),
            "-i", video_path,
            "-c:v", "copy",
            "-c:a", "copy",
            str(output_file)
        ]

        try:
            subprocess.run(cmd, check=True, capture_output=True)
        except subprocess.CalledProcessError as e:
            print("FFmpeg failed:", e.stderr.decode())
            continue

        temp_paths.append(
            TempClip(
                path=str(output_file),
                title=valid_clip.title,
                start=valid_clip.start,
                end=valid_clip.end
            )
        )
    print("clipped videos")
    return temp_paths