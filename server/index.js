import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { factsRouter } from './routes/facts.js';
import { statsRouter } from './routes/stats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Middleware
// Configuration de CORS
const corsOptions = {
  origin: 'https://lanterna.njossedev.fr', // Permet les requêtes de cette origine
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers autorisés
};

app.use(cors(corsOptions));
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
app.use('/facts', factsRouter);
app.use('/stats', statsRouter);

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