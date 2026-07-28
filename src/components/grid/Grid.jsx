import Row from './Row';

export default function Grid({ currentGuess, guesses, turn, wordLength, shakeSignal }) {
  return (
    <div className="motus-grid-container">
      {guesses.map((guess, index) => {
        if (turn === index) {
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