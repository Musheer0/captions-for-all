import subprocess

def burn_caption_to_video(srt,video,output,temp):
        subprocess.run([
            "ffmpeg",
            "-y",
            "-loglevel", "error",
            "-i",
            str(video),
            "-vf", f"subtitles='{srt}':fontsdir=/usr/share/fonts:force_style='FontName=Noto Sans'",
            "-c:v", "libx264",
            "-preset", "veryfast",   # 🔥 speed boost
            "-crf", "23",   
            "-c:a", "copy",
            temp,
            ],check=True)
        return temp
def soft_burn_caption_to_video(srt,video,lang,temp):
        subprocess.run([
            "ffmpeg",
            "-y",
            "-loglevel", "info",
            "-i",
            str(video),
            "-i",
            str(srt),
            "-c:v", "copy",
            "-c:a", "copy",
            "-c:s","srt",
            f"-metadata:s:s:0",
            "language={lang}",
            temp,
            ],check=True)
        return temp
