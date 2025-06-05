import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/wit', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch(`https://api.wit.ai/message?q=${encodeURIComponent(message)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.WIT_AI_TOKEN}`,
      },
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al conectar con Wit.ai:', error);
    res.status(500).json({ error: 'Error al conectar con Wit.ai' });
  }
});

export default router;
