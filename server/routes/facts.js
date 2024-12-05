import express from 'express';
import asyncHandler from 'express-async-handler';
import { verifyFactWithGPT } from '../services/openai.js';
import { getRandomFact } from '../services/facts.js';

export const factsRouter = express.Router();

factsRouter.get('/random', asyncHandler(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://lanterna.njossedev.fr');
  const fact = await getRandomFact();
  if (!fact || !fact.realNews || !fact.fakeNews) {
    res.status(500).json({ error: 'Invalid fact data' });
    return;
  }
  res.json(fact);
}));

factsRouter.post('/verify', asyncHandler(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://lanterna.njossedev.fr');
  const { sentence } = req.body;
  if (!sentence) {
    res.status(400).json({ error: 'Sentence is required' });
    return;
  }
  
  const result = await verifyFactWithGPT(sentence);
  if (!result || !result.hasOwnProperty('isTrue')) {
    res.status(500).json({ error: 'Invalid verification result' });
    return;
  }
  
  res.json(result);
}));

<<<<<<< HEAD
// Error handling middleware
factsRouter.use((err, req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://lanterna.njossedev.fr');
=======
// Ajoutez ce code vers la fin de facts.js, avant le middleware de gestion des erreurs

router.post('/generate', asyncHandler(async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    res.status(400).json({ error: 'Topic is required' });
    return;
  }

  const result = await generateFactWithGPT(topic);  // Vous devrez créer cette fonction
  if (!result || !result.hasOwnProperty('realNews') || !result.hasOwnProperty('fakeNews')) {
    res.status(500).json({ error: 'Invalid generation result' });
    return;
  }

  res.json(result);
}));

// Middleware de gestion des erreurs (ne modifiez pas cette partie)
router.use((err, req, res, next) => {
>>>>>>> 60cf3010 (puzzle displayed)
  console.error('Facts Router Error:', err);
  res.status(500).json({
    error: 'An error occurred while processing your request',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});