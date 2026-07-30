const API_BASE = '/api';

export async function submitScore(pseudo, score) {
  const res = await fetch(`${API_BASE}/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pseudo, score }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Erreur lors de l'enregistrement du score");
  }
  return res.json();
}

export async function getTopScores() {
  const res = await fetch(`${API_BASE}/scores/top`);
  if (!res.ok) throw new Error('Erreur lors de la récupération du classement');
  return res.json();
}
