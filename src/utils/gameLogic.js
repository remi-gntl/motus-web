// src/utils/gameLogic.js

/**
 * Compare le mot proposé avec le mot cible.
 * Retourne un tableau d'objets avec le statut de chaque lettre.
 * status: 'correct' (rouge), 'present' (jaune), 'absent' (bleu)
 */
export function checkGuess(targetWord, guessWord) {
  const result = [];
  const targetLetters = targetWord.split('');
  const guessLetters = guessWord.split('');

  // 1. On initialise le résultat de base (tout en "absent")
  for (let i = 0; i < guessLetters.length; i++) {
    result.push({ letter: guessLetters[i], status: 'absent' });
  }

  // 2. Première passe : on cherche les correspondances exactes (ROUGE)
  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i].status = 'correct';
      targetLetters[i] = null; // On "consomme" la lettre du mot cible pour ne pas la recompter
    }
  }

  // 3. Deuxième passe : on cherche les lettres mal placées (JAUNE)
  for (let i = 0; i < guessLetters.length; i++) {
    // Si la lettre n'est pas déjà correcte
    if (result[i].status !== 'correct') {
      const indexInTarget = targetLetters.indexOf(guessLetters[i]);
      
      // Si la lettre existe ailleurs dans le mot cible et n'a pas été consommée
      if (indexInTarget !== -1) {
        result[i].status = 'present';
        targetLetters[indexInTarget] = null; // On "consomme" cette lettre
      }
    }
  }

  return result;
}