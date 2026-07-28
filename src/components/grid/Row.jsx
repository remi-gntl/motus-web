import Cell from './Cell';

export default function Row({ guess, currentGuess, wordLength, shakeSignal }) {
  if (guess) {
    const isWinningRow = guess.every(l => l.status === 'correct');
    return (
      <div className="flex gap-1 mb-1 justify-center">
        {guess.map((letterObj, index) => (
          <Cell
            key={index}
            value={letterObj.letter}
            status={letterObj.status}
            delay={index * 150}
            celebrate={isWinningRow}
          />
        ))}
      </div>
    );
  }

  if (currentGuess) {
    return (
      <div
        key={shakeSignal}
        className={`flex gap-1 mb-1 justify-center ${shakeSignal ? 'row-shake' : ''}`}
      >
        {currentGuess.map((letter, index) => (
          <Cell key={`${index}-${letter}`} value={letter} />
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