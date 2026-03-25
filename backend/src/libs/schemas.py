from pydantic import BaseModel
from collections import OrderedDict
from typing import TypedDict, Any
from pydantic import BaseModel, Field
class SrtSegment(TypedDict):
    start: float
    end: float
    text: str

class ProcessVideoRequest(BaseModel):
        video_key: str = Field(..., min_length=1)
        video_id: str = Field(..., min_length=1)
class BurnCaptionToVideo(BaseModel):
        video_key: str = Field(..., min_length=1)
        video_id: str = Field(..., min_length=1)
        caption_key:str =Field(...,min_length=1)
        lang_code:str=Field(...,min_length=2)
class ExtractCaptionResponse(BaseModel):
        result_key: str
        language: str
class ClipVideoRequest(BaseModel):
        video_id:str
        video_key:str
        caption_key:str
        clip_count:int
        user_id:str

class UploadedClip(BaseModel):
        path:str
        name:str
        size:int
class ClipVideoResponse(BaseModel):
        clips:list[UploadedClip]
class ExtractCaptionResult(TypedDict):
    language: str
    raw_segments: Any
    srt: list[SrtSegment]
class BurnCaptionResponse(BaseModel):
    success: bool
    cached: bool
    output_path: str
    lang: str