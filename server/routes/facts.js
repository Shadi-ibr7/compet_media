import express from 'express';
import asyncHandler from 'express-async-handler';
import { verifyFactWithGPT } from '../services/openai.js';
import { getRandomFact } from '../services/facts.js';

export const router = express.Router();

router.get('/random', asyncHandler(async (req, res) => {
  const fact = await getRandomFact();
  if (!fact || !fact.realNews || !fact.fakeNews) {
    res.status(500).json({ error: 'Invalid fact data' });
    return;
  }
  res.json(fact);
}));

router.post('/verify', asyncHandler(async (req, res) => {
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

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Facts Router Error:', err);
  res.status(500).json({
    error: 'An error occurred while processing your request',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});