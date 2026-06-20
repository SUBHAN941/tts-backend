const express = require("express");
const cors = require("cors");
const healthRoutes =
  require(
    "./routes/health.routes"
  );
const ttsRoutes = require("./routes/tts.routes");



const app = express();

app.use(cors());

app.use(express.json({
  limit: "50mb",
}));
const path = require("path");



app.use(
  "/audio",
  express.static(
    path.join(
      process.cwd(),
      "audio"
    )
  )
);
app.use(
  "/api/health",
  healthRoutes
);
app.use(
  "/api/health",
  healthRoutes
);
app.use("/api/tts", ttsRoutes);

module.exports = app;