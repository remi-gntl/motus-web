import { useState } from 'react';
import { submitScore } from '../../utils/api';

export default function ScoreSubmitModal({ score, onClose, onSubmitted }) {
  const [pseudo, setPseudo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = pseudo.trim();
    if (!trimmed) {
      setError('Entre un pseudo avant de valider.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await submitScore(trimmed, score);
      onSubmitted();
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 p-6 max-w-sm w-full">
        <h2 className="text-motus-yellow text-2xl font-extrabold mb-2 text-center uppercase tracking-wide">
          Score enregistré !
        </h2>
        <p className="text-white text-center mb-4">
          Tu as fini avec <span className="text-motus-yellow font-bold">{score}</span> points.
          Entre ton nom pour l'inscrire au classement :
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            maxLength={20}
            placeholder="Ton pseudo"
            autoFocus
            className="rounded px-4 py-2 bg-gray-900 text-white border border-gray-600 focus:border-motus-yellow focus:outline-none"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-2 justify-center mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-500 text-gray-300 hover:bg-gray-700"
            >
              Passer
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-motus-blue text-white px-6 py-2 rounded font-bold uppercase tracking-wide hover:bg-blue-500 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Envoi...' : 'Valider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}