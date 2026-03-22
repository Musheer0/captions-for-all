import requests
import os 
from fastapi import HTTPException
def translate_captions(srt, target,source):
    if os.environ["LINGO_KEY"]:
        print("Loaded envs for translation")
    response = requests.post(
        "https://api.lingo.dev/process/localize",
        headers={
            "X-API-Key": os.environ["LINGO_KEY"],
            "Content-Type":"application/json"
        },
        json={
        "sourceLocale": source,
        "targetLocale": target,
        "data":{
            "srt":srt
        }
        }
    )
    if not response.ok:
        raise  HTTPException(status_code=400,detail="error translating srt")
    return response.json()["data"]["srt"]

translate_captions({"text":"how are you"}, "en","ar")

