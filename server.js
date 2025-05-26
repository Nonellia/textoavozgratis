const express = require('express');
const bodyParser = require('body-parser');
const googleTTS = require('google-tts-api');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // Necesario si usas Node <18
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/audios', express.static(path.join(__dirname, 'audios')));

// Ruta principal
app.get('/', (req, res) => {
  res.send('Servidor TTS funcionando 🟢');
});

// Ruta para texto a voz
app.post('/tts', async (req, res) => {
  try {
    const { texto, lang = 'es-ES', speed = 1.0 } = req.body;
    if (!texto || texto.trim() === '') {
      return res.status(400).json({ error: 'Texto vacío' });
    }

    const url = googleTTS.getAudioUrl(texto, {
      lang,
      slow: false,
      speed: parseFloat(speed),
      host: 'https://translate.google.com',
    });

    const filename = `${uuidv4()}.mp3`;
    const filepath = path.join(__dirname, 'audios', filename);

    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFileSync(filepath, buffer);

    res.json({ url: `/audios/${filename}` });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al generar el audio');
  }
});

// Crear carpeta audios si no existe
const audiosDir = path.join(__dirname, 'audios');
if (!fs.existsSync(audiosDir)) {
  fs.mkdirSync(audiosDir);
}

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
