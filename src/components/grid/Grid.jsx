import Row from './Row';

export default function Grid({ currentGuess, guesses, turn, wordLength, shakeSignal, isCorrect }) {
  const cellSize = `clamp(1.75rem, calc((100vw - 3rem) / ${wordLength} - 0.35rem), 4rem)`;

  return (
    <div className="motus-grid-container" style={{ '--cell-size': cellSize }}>
      {guesses.map((guess, index) => {
        if (turn === index && !isCorrect) {
          return (
            <Row
              key={index}
              currentGuess={currentGuess}
              wordLength={wordLength}
              shakeSignal={shakeSignal}
            />
          );
        }
        return <Row key={index} guess={guess} wordLength={wordLength} />;
      })}
    </div>
  );
}