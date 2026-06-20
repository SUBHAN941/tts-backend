const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

function mergeAudio(
  files,
  outputFile
) {
  return new Promise(
    (resolve, reject) => {

      const path = require("path");

const listFile = path.join(
  process.cwd(),
  "merge-list.txt"
);

      console.log(
        "\n=== MERGE SERVICE ==="
      );

      console.log(
        "Output File:",
        outputFile
      );

      console.log(
        "List File:",
        listFile
      );

      console.log(
        "Input Files:",
        files
      );

      const content =
        files
          .map(
            (file) =>
              `file '${file.replace(
                /\\/g,
                "/"
              )}'`
          )
          .join("\n");

      console.log(
        "\nList Content:\n"
      );

      console.log(
        content
      );

      fs.writeFileSync(
        listFile,
        content,
        "utf8"
      );

      console.log(
        "\nTXT File Created"
      );
console.log(
  "TXT Exists:",
  fs.existsSync(listFile)
);

console.log(
  "TXT Path:",
  listFile
);

console.log(
  "TXT Content:"
);

console.log(content);
      ffmpeg()
  .input(
    listFile.replace(
      /\\/g,
      "/"
    )
  )
        .inputOptions([
          "-f",
          "concat",
          "-safe",
          "0",
        ])
        .outputOptions([
          "-c",
          "copy",
        ])
        .on(
          "start",
          (command) => {
            console.log(
              "\nFFmpeg Command:"
            );

            console.log(
              command
            );
          }
        )
        .on(
          "end",
          () => {
            console.log(
              "\nMerge Finished"
            );

            if (
              fs.existsSync(
                listFile
              )
            ) {
              fs.unlinkSync(
                listFile
              );
            }

            resolve(
              outputFile
            );
          }
        )
        .on(
          "error",
          (err) => {
            console.error(
              "\nMERGE ERROR:"
            );

            console.error(
              err
            );

            reject(err);
          }
        )
        .save(outputFile);
    }
  );
}

module.exports = {
  mergeAudio,
};