from kokoro import KPipeline
import soundfile as sf
import numpy as np
import sys

print("STEP 1")

text = sys.argv[1]
output_path = sys.argv[2]
voice = sys.argv[3]

print("TEXT LENGTH:", len(text))

pipeline = KPipeline(lang_code='a')

print("STEP 2 - Pipeline Loaded")

generator = pipeline(
    text,
    voice=voice
)

print("STEP 3 - Generator Created")

audio_parts = []

for i, (_, _, audio) in enumerate(generator):
    print(f"SEGMENT {i}")
    audio_parts.append(audio)

print("STEP 4 - All Segments Generated")

final_audio = np.concatenate(audio_parts)

print("STEP 5 - Concatenated")

sf.write(
    output_path,
    final_audio,
    24000
)

print("STEP 6 - Saved")