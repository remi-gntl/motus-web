export function checkGuess(targetWord, guessWord) {
  const result = [];
  const targetLetters = targetWord.split('');
  const guessLetters = guessWord.split('');

  for (let i = 0; i < guessLetters.length; i++) {
    result.push({ letter: guessLetters[i], status: 'absent' });
  }

  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i].status = 'correct';
      targetLetters[i] = null; 
    }
  }

  for (let i = 0; i < guessLetters.length; i++) {
    if (result[i].status !== 'correct') {
      const indexInTarget = targetLetters.indexOf(guessLetters[i]);
      
      if (indexInTarget !== -1) {
        result[i].status = 'present';
        targetLetters[indexInTarget] = null;
      }
    }
  }

  return result;
}