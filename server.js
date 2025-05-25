const express = require("express");
const googleTTS = require("google-tts-api");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor de texto a voz activo.");
});

app.get("/api/audio", async (req, res) => {
  const texto = req.query.text;

  if (!texto) {
    return res.status(400).json({ error: "Falta el parámetro 'text'" });
  }

  try {
    const url = googleTTS.getAudioUrl(texto, {
      lang: "es",
      slow: false,
      host: "https://translate.google.com",
    });

    res.redirect(url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al generar el audio" });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
