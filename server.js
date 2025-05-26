const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');
const path = require('path');
const gTTS = require('google-tts-api');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir archivos de audio temporales
app.use('/audio', express.static('/tmp'));

app.post('/tts', async (req, res) => {
  const texto = req.body.texto;

  if (!texto) {
    return res.status(400).send('Texto requerido');
  }

  try {
    const url = gTTS.getAudioUrl(texto, {
      lang: 'es',
      slow: false,
      host: 'https://translate.google.com',
    });

    const response = await fetch(url);
    const buffer = await response.buffer();

    const fileName = `voz_${Date.now()}.mp3`;
    const filePath = path.join('/tmp', fileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/audio/${fileName}`; // Ruta estática desde Express

    res.json({ url: publicUrl }); // El frontend accede a esto
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al generar el audio');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
