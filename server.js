const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/audio", async (req, res) => {
  const texto = req.query.text;
  if (!texto) return res.status(400).send("Falta el texto");

  try {
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=es&q=${encodeURIComponent(texto)}`;
    const response = await axios.get(googleUrl, { responseType: "stream" });

    // Configura los headers para forzar la descarga
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": 'attachment; filename="voz.mp3"',
    });

    response.data.pipe(res); // Stream el audio directamente al cliente
  } catch (error) {
    console.error("Error al obtener el audio:", error);
    res.status(500).send("Error al generar el audio");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor proxy corriendo en ${PORT}`));