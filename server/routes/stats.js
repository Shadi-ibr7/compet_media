import express from 'express';
import asyncHandler from 'express-async-handler';

export const router = express.Router();

router.post('/attempt', asyncHandler(async (req, res) => {
  const { isCorrect } = req.body;
  if (typeof isCorrect !== 'boolean') {
    res.status(400).json({ error: 'isCorrect must be a boolean value' });
    return;
  }

  const db = req.app.locals.db;
  
  await new Promise((resolve, reject) => {
    db.run(`
      UPDATE stats 
      SET 
        correct_attempts = correct_attempts + ?,
        total_attempts = total_attempts + 1
      WHERE id = 1
    `, [isCorrect ? 1 : 0], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  res.json({ success: true });
}));

router.get('/', asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  
  const stats = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM stats WHERE id = 1", (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

  if (!stats) {
    res.status(404).json({ error: 'Stats not found' });
    return;
  }

  res.json(stats);
}));

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Stats Router Error:', err);
  res.status(500).json({
    error: 'An error occurred while processing your request',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});