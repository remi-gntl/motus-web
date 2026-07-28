import { useEffect, useState } from "react";
import Grid from "./components/grid/Grid";
import Keyboard from "./components/keyboard/Keyboard";
import Confetti from "./components/Confetti";
import useWordle from "./hooks/useWordle";
import { loadDictionary, getRandomWord } from "./utils/words";

function App() {
  const [solution, setSolution] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const initGame = async () => {
      await loadDictionary();
      if (active) {
        setSolution(getRandomWord());
        setIsLoading(false);
      }
    };
    initGame();
    return () => {
      active = false;
    };
  }, []);

  if (isLoading || !solution) {
    return (
      <div className="min-h-screen motus-studio-bg flex items-center justify-center text-white text-2xl font-bold">
        Chargement...
      </div>
    );
  }

  return <Game key={solution} solution={solution} setSolution={setSolution} />;
}

function Game({ solution, setSolution }) {
  const {
    currentGuess,
    handleKeyup,
    guesses,
    isCorrect,
    turn,
    usedKeys, 
    errorMsg,
    shakeSignal,
  } = useWordle(solution);

  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);
    return () => window.removeEventListener("keyup", handleKeyup);
  }, [handleKeyup]);

  const handleReplay = () => setSolution(getRandomWord());
  const isGameOver = isCorrect || turn > 5;

  return (
    <div className="min-h-screen motus-studio-bg flex flex-col items-center py-6 sm:py-10">
      {isCorrect && <Confetti />}

      <h1
        className="text-5xl font-extrabold text-motus-yellow mb-2 tracking-widest italic"
        style={{
          textShadow:
            "3px 3px 0 var(--color-motus-red), 6px 6px 14px rgba(0,0,0,0.5)",
        }}
      >
        MOTUS
      </h1>

      <div className="h-8 mb-4">
        {errorMsg && (
          <div className="bg-red-500 text-white px-4 py-1 rounded font-bold animate-pulse">
            {errorMsg}
          </div>
        )}
      </div>

      <Grid
        currentGuess={currentGuess}
        guesses={guesses}
        turn={turn}
        wordLength={solution.length}
        shakeSignal={shakeSignal}
      />

      {!isGameOver && (
        <Keyboard usedKeys={usedKeys} handleKeyup={handleKeyup} />
      )}

      {isGameOver && (
        <div className="result-panel mt-8 flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700">
          {isCorrect ? (
            <p className="text-green-400 font-bold text-2xl mb-4">Bravo ! 🎉</p>
          ) : (
            <p className="text-red-400 font-bold text-xl mb-4">
              Perdu... Le mot était{" "}
              <span className="text-white">{solution}</span>
            </p>
          )}
          <button
            onClick={handleReplay}
            className="bg-motus-blue text-white px-8 py-3 rounded font-bold uppercase tracking-wide hover:bg-blue-500 transition-colors shadow-lg"
          >
            Rejouer
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
