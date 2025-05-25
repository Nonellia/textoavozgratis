const express = require("express");
const googleTTS = require("google-tts-api");
// const cors = require("cors");

const app = express();
const port = 3000;

// app.use(cors());
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
  res.send("Servidor de texto a voz activo.");
});

// Ruta para generar audio
app.get("/api/audio", async (req, res) => {
  const texto = req.query.text;

  if (!texto) {
    return res.status(400).json({ error: "Falta el parámetro 'text'" });
  }

  try {
    // Obtener URL del audio
    const url = googleTTS.getAudioUrl(texto, {
      lang: "es",
      slow: false,
      host: "https://translate.google.com",
    });

    res.redirect(url); // Redirige directamente al archivo MP3
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al generar el audio" });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
