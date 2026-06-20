const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const voicesConfig =
  require("../config/voices");

const {
  getIO,
} = require("../socket");

const {
  generateSpeech,
} = require("../services/kokoro.service");

const {
  convertToMp3,
} = require("../services/ffmpeg.service");

const {
  splitText,
} = require("../services/chunk.service");

const {
  mergeAudio,
} = require("../services/merge.service");

const voices = [
  ...voicesConfig.female.map(
    (v) => v.id
  ),
  ...voicesConfig.male.map(
    (v) => v.id
  ),
];
console.log(
  "REQUEST RECEIVED:",
  Date.now()
);
const generate = async (
  req,
  res
) => {
  try {
    const {
      text,
      voice = "af_heart",
    } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message:
          "Text is required",
      });
    }

    if (
      !voices.includes(
        voice
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid voice",
      });
    }

    if (
      text.length > 100000
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Maximum text length exceeded",
      });
    }

    console.log(
      "\n========== NEW REQUEST =========="
    );

    console.log(
      "1. Text Length:",
      text.length
    );

    const chunks =
      splitText(
        text,
        1000
      );

    console.log(
      "2. Total Chunks:",
      chunks.length
    );

    const wavFiles = [];

    const io = getIO();

    for (
      let i = 0;
      i < chunks.length;
      i++
    ) {

      console.log(
        `3. Generating Chunk ${i + 1}/${chunks.length}`
      );

      io.emit(
        "chunk-progress",
        {
          current:
            i + 1,
          total:
            chunks.length,
          status:
            "processing",
        }
      );

      console.time(
        `Chunk ${i + 1}`
      );

      const generatedPath =
        await generateSpeech(
          chunks[i],
          voice
        );

      console.timeEnd(
        `Chunk ${i + 1}`
      );

      io.emit(
        "chunk-progress",
        {
          current:
            i + 1,
          total:
            chunks.length,
          status:
            "completed",
        }
      );

      console.log(
        `4. Chunk ${i + 1} Generated`
      );

      wavFiles.push(
        generatedPath
      );
    }

    console.log(
      "5. WAV Files:",
      wavFiles
    );

    const mergedWav =
      path.join(
        process.cwd(),
        "audio",
        "wav",
        `${uuidv4()}-merged.wav`
      );

    console.log(
      "6. Merged WAV Path:",
      mergedWav
    );

    console.log(
      "7. Starting Merge..."
    );

    await mergeAudio(
      wavFiles,
      mergedWav
    );

    console.log(
      "8. Merge Complete"
    );

    const mp3File =
      `${uuidv4()}.mp3`;

    const mp3Path =
      path.join(
        process.cwd(),
        "audio",
        "mp3",
        mp3File
      );

    console.log(
      "9. Starting MP3 Conversion..."
    );

    await convertToMp3(
      mergedWav,
      mp3Path
    );

    console.log(
      "10. MP3 Conversion Complete"
    );

    console.log(
      "11. Starting Cleanup..."
    );

    wavFiles.forEach(
      (file) => {
        if (
          fs.existsSync(
            file
          )
        ) {
          fs.unlinkSync(
            file
          );
        }
      }
    );

    if (
      fs.existsSync(
        mergedWav
      )
    ) {
      fs.unlinkSync(
        mergedWav
      );
    }

    console.log(
      "12. Cleanup Complete"
    );

    return res.json({
      success: true,
      voice,
      characters:
        text.length,
      chunks:
        chunks.length,
      audioUrl:
        `http://localhost:5000/audio/mp3/${mp3File}`,
    });

  } catch (error) {
    console.error(
      "\nERROR:"
    );

    console.error(
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error.message,
    });
  }
};

const getVoices = (
  req,
  res
) => {
  return res.json({
    success: true,
    ...voicesConfig,
  });
};

module.exports = {
  generate,
  getVoices,
};