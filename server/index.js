import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { router as factsRouter } from './routes/facts.js';
import { router as statsRouter } from './routes/stats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database initialization
const db = new sqlite3.Database(join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Database initialization error:', err);
    process.exit(1);
  }
});

// Initialize database tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      correct_attempts INTEGER DEFAULT 0,
      total_attempts INTEGER DEFAULT 0
    )
  `);

  db.get("SELECT COUNT(*) as count FROM stats", (err, row) => {
    if (err) {
      console.error('Error checking stats table:', err);
      return;
    }
    if (row.count === 0) {
      db.run("INSERT INTO stats (correct_attempts, total_attempts) VALUES (0, 0)");
    }
  });
});

// Make db available to routes
app.locals.db = db;

// Routes
app.use('/api/facts', factsRouter);
app.use('/api/stats', statsRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({
    error: 'An error occurred while processing your request',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Serve static files
app.use(express.static('dist'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Handle process termination
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    }
    process.exit(err ? 1 : 0);
  });
});