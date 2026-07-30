import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database(path.join('/app/data', 'scores.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pseudo TEXT NOT NULL UNIQUE,
    score INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

app.post('/api/scores', (req, res) => {
  const { pseudo, score } = req.body;

  if (!pseudo || typeof pseudo !== 'string' || pseudo.trim().length === 0) {
    return res.status(400).json({ error: 'Pseudo invalide' });
  }
  if (!Number.isInteger(score) || score <= 0) {
    return res.status(400).json({ error: 'Score invalide' });
  }

  const pseudoClean = pseudo.trim().slice(0, 20);

  const stmt = db.prepare(`
    INSERT INTO scores (pseudo, score) VALUES (?, ?)
    ON CONFLICT(pseudo) DO UPDATE SET
      score = MAX(score, excluded.score),
      created_at = CASE WHEN excluded.score > score THEN datetime('now') ELSE created_at END
  `);
  stmt.run(pseudoClean, score);

  res.json({ success: true });
});

app.get('/api/scores/top', (req, res) => {
  const rows = db.prepare(
    'SELECT pseudo, score, created_at FROM scores ORDER BY score DESC LIMIT 5'
  ).all();

  res.json(rows);
});

app.listen(3000, () => {
  console.log('Motus API démarrée sur le port 3000');
});
