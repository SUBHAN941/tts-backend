const express = require("express");

const {
  generate,
  getVoices
} = require(
  "../controllers/tts.controller"
);

const router =
  express.Router();

router.post(
  "/generate",
  generate
);

router.get(
  "/voices",
  getVoices
);

module.exports =
  router;