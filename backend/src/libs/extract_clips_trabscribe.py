from groq import Groq
import json
from pydantic import BaseModel, field_validator, model_validator
from typing import List
import os

class Clip(BaseModel):
    start: float
    end: float
    title: str

    # 🔹 basic sanity checks
    @field_validator("start", "end")
    @classmethod
    def check_positive(cls, v):
        if v < 0:
            raise ValueError("timestamps must be >= 0")
        return v

    # 🔹 logical check (start < end)
    @model_validator(mode="after")
    def check_time_order(self):
        if self.start >= self.end:
            raise ValueError("start must be less than end")
        return self

    # 🔹 duration constraint (5s–60s)
    @model_validator(mode="after")
    def check_duration(self):
        duration = self.end - self.start
        if duration < 5 or duration > 60:
            raise ValueError(f"clip duration must be 5–60s, got {duration:.2f}s")
        return self

    # 🔹 clean text
    @field_validator("title")
    @classmethod
    def not_empty(cls, v):
        if not v.strip():
            raise ValueError("text fields cannot be empty")
        return v.strip()


class ClipsResponse(BaseModel):
    clips: List[Clip]

client = Groq(api_key=os.environ["GROQ_KEY"])

prompt = """
SYSTEM ROLE:
You are an expert short-form content editor specializing in viral video clips.

INPUT FORMAT (STRICT):
You will receive:
1. transcript_json: array of words with timestamps
   Each item:
   {
     "text": string,
     "start": float (seconds),
     "end": float (seconds)
   }

2. max_clips: integer

TASK:
Analyze the transcript and return up to max_clips highly viral clips.

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "clips": [
    {
      "start": float,
      "end": float,
      "title": string,
      "reason": string
    }
  ]
}

IMPORTANT:
- Only return JSON
- No extra text
"""

def clip_transcribe(srt: list, clips: int):
    completion = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {"role": "system", "content": prompt},
            {
                "role": "user",
                "content": json.dumps({
                    "max_clips": clips,
                    "transcript_json": srt
                })
            }
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "type": "object",
                "properties": {
                    "clips": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "start": {"type": "number"},
                                "end": {"type": "number"},
                                "title": {"type": "string"},
                            },
                            "required": ["start", "end", "title"]
                        }
                    }
                },
                "required": ["clips"]
            }
        }
    )

    raw = completion.choices[0].message.content

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        raise ValueError(f"Invalid JSON from model:\n{raw}")

    try:
        validated = ClipsResponse(**parsed)
    except ValidationError as e:
        raise ValueError(f"Schema validation failed:\n{e}")

    return validated.clips