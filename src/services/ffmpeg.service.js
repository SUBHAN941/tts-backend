const ffmpeg = require("fluent-ffmpeg");

function convertToMp3(
  inputPath,
  outputPath
) {
  return new Promise(
    (resolve, reject) => {
      ffmpeg(inputPath)
        .audioCodec("libmp3lame")
        .toFormat("mp3")
        .on("end", () => {
          resolve(outputPath);
        })
        .on("error", (err) => {
          reject(err);
        })
        .save(outputPath);
    }
  );
}

module.exports = {
  convertToMp3,
};