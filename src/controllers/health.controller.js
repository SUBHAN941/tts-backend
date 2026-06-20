const health = (
  req,
  res
) => {
  return res.json({
    success: true,
    status: "ok",
    message:
      "TTS API is running"
  });
};

module.exports = {
  health
};