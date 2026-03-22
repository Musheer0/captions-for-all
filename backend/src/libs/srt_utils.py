from pydantic import BaseModel
from collections import OrderedDict
from typing import TypedDict, Any
from libs.schemas import SrtSegment
def format_to_words_srt(words: list) -> list[SrtSegment]:
        """Convert word-level alignments to SRT segments."""
        segments = []
        for word in words:
            if not isinstance(word, dict):
                continue

            if "start" in word and "end" in word:
                segments.append({
                    "start": word["start"],
                    "end": word["end"],
                    "text": word["word"],
                })
        return segments
def words_to_srt(words, max_words=6):
    subtitles = []
    chunk = []

    for w in words:
        chunk.append(w)

        if len(chunk) >= max_words:
            subtitles.append(chunk)
            chunk = []

    if chunk:
        subtitles.append(chunk)

    srt_lines = []
    for i, group in enumerate(subtitles, start=1):
        start = group[0]["start"]
        end = group[-1]["end"]
        text = " ".join(w["text"] for w in group)

        srt_lines.append(
            f"{i}\n"
            f"{seconds_to_srt_time(start)} --> {seconds_to_srt_time(end)}\n"
            f"{text}\n"
        )

    return "\n".join(srt_lines)

def seconds_to_srt_time(seconds: float) -> str:
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds - int(seconds)) * 1000)

    return f"{hrs:02}:{mins:02}:{secs:02},{millis:03}"


