const axios = require("axios");

async function generateSpeech(
  text,
  voice
) {

  const response =
    await axios.post(
      "http://127.0.0.1:8000/generate",
      {
        text,
        voice
      }
    );

  return response.data.path;
}

module.exports = {
  generateSpeech
};