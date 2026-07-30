import { useEffect, useState } from 'react';
import { getTopScores } from '../../utils/api';

export default function LeaderboardModal({ onClose }) {
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getTopScores()
      .then(setScores)
      .catch(() => setError('Impossible de charger le classement.'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 p-6 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-motus-yellow text-2xl font-extrabold uppercase tracking-wide">
            🏆 Classement
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none cursor-pointer">
            &times;
          </button>
        </div>

        {isLoading && <p className="text-white text-center">Chargement...</p>}
        {error && <p className="text-red-400 text-center">{error}</p>}

        {!isLoading && !error && scores.length === 0 && (
          <p className="text-gray-400 text-center">Aucun score enregistré pour le moment.</p>
        )}

        {!isLoading && !error && scores.length > 0 && (
          <ol className="flex flex-col gap-2">
            {scores.map((s, i) => (
              <li key={i} className="flex justify-between items-center bg-gray-900 rounded px-4 py-2">
                <span className="text-white font-bold">
                  <span className="text-motus-yellow mr-2">#{i + 1}</span>
                  {s.pseudo}
                </span>
                <span className="text-motus-yellow font-extrabold">{s.score}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}