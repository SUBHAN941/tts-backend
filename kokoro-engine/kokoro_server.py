from flask import Flask, request, jsonify
from kokoro import KPipeline
import soundfile as sf
import numpy as np
import uuid
import os
import time

app = Flask(__name__)

print("Loading Kokoro...")

pipeline = KPipeline(
    lang_code="a"
)

print("Kokoro Loaded")

@app.route(
    "/generate",
    methods=["POST"]
)
def generate():

    data = request.json

    text = data["text"]

    voice = data.get(
        "voice",
        "af_heart"
    )

    start = time.time()

    project_root = os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )

    output_path = os.path.join(
        project_root,
        "audio",
        "wav",
        f"{uuid.uuid4()}.wav"
    )

    os.makedirs(
        os.path.dirname(output_path),
        exist_ok=True
    )

    print(f"Generating Voice={voice}")
    gen_start = time.time()

    generator = pipeline(
        text,
        voice=voice
    )
    print(
    "Pipeline Created:",
    round(
        time.time() - gen_start,
        2
    ),
    "sec"
)

    audio_parts = []
    print(
    "Audio Generated:",
    round(
        time.time() - gen_start,
        2
    ),
    "sec"
)

    for _, _, audio in generator:
        audio_parts.append(audio)

    final_audio = np.concatenate(
        audio_parts
    )

    sf.write(
        output_path,
        final_audio,
        24000
    )

    print(
        "Generation Time:",
        round(
            time.time() - start,
            2
        ),
        "seconds"
    )

    print(
        f"Saved: {output_path}"
    )

    return jsonify({
        "path": output_path
    })

app.run(
    port=8000
)