import Cell from './Cell';

export default function Row({ guess, currentGuess, knownLetters, wordLength }) {
  
  if (guess) {
    return (
      <div className="flex gap-1 mb-1 justify-center">
        {guess.map((letterObj, index) => (
          <Cell key={index} value={letterObj.letter} status={letterObj.status} />
        ))}
      </div>
    );
  }

  if (currentGuess !== undefined) {
    const letters = currentGuess.split('');
    const allCells = [];

    for (let i = 0; i < wordLength; i++) {
      if (letters[i]) {
        allCells.push(letters[i]);
      } else if (knownLetters && knownLetters[i]) {
        allCells.push(knownLetters[i]);
      } else {
        allCells.push('');
      }
    }

    return (
      <div className="flex gap-1 mb-1 justify-center">
        {allCells.map((letter, index) => (
          <Cell key={index} value={letter} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-1 mb-1 justify-center">
      {[...Array(wordLength)].map((_, index) => (
        <Cell key={index} value="" />
      ))}
    </div>
  );
}