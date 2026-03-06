import Row from './Row';

export default function Grid({ currentGuess, guesses, turn, knownLetters, wordLength }) {
  return (
    <div className="motus-grid-container">
      {guesses.map((guess, index) => {
        if (turn === index) {
          return (
            <Row 
              key={index} 
              currentGuess={currentGuess} 
              knownLetters={knownLetters} 
              wordLength={wordLength} 
            />
          );
        }
        return <Row key={index} guess={guess} wordLength={wordLength} />;
      })}
    </div>
  );
}