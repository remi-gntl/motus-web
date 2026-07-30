import { useEffect, useState } from "react";
import Grid from "./components/grid/Grid";
import Keyboard from "./components/keyboard/Keyboard";
import Confetti from "./components/layout/Confetti";
import useWordle from "./hooks/useWordle";
import { loadDictionary, getRandomWord } from "./utils/words";

function App() {
  const [solution, setSolution] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem('motus-score');
    return savedScore ? parseInt(savedScore, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('motus-score', score);
  }, [score]);

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

  const handleNextWord = () => {
    setSolution(getRandomWord());
  };

  if (isLoading || !solution) {
    return (
      <div className="min-h-screen motus-studio-bg flex items-center justify-center text-white text-2xl font-bold">
        Chargement...
      </div>
    );
  }

  return (
    <Game 
      key={solution} 
      solution={solution} 
      score={score}
      setScore={setScore}
      onNextWord={handleNextWord} 
    />
  );
}

function Game({ solution, score, setScore, onNextWord }) {
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

  const isGameOver = isCorrect || turn > 5;

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isGameOver) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isGameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isGameOver) handleKeyup(e);
    };
    window.addEventListener("keyup", handleKeyDown);
    return () => window.removeEventListener("keyup", handleKeyDown);
  }, [handleKeyup, isGameOver]);

  useEffect(() => {
    if (isCorrect) {
      const points = (solution.length * 20) - (turn * 5);
      setScore((prev) => prev + points); 
      
      const timer = setTimeout(() => {
        onNextWord(); 
      }, 3500); 
      
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCorrect]); 

  const handleReplay = () => {
    setScore(0);
    onNextWord();
  };

  return (
    <div className="min-h-screen motus-studio-bg flex flex-col items-center py-6 sm:py-10 relative overflow-hidden">
      
      {isCorrect && <Confetti />}

      <div className="flex w-full max-w-lg justify-between items-end px-4 mb-4">
        <h1
          className="text-5xl font-extrabold text-motus-yellow tracking-widest italic"
          style={{
            textShadow: "3px 3px 0 var(--color-motus-red), 6px 6px 14px rgba(0,0,0,0.5)",
          }}
        >
          MOTUS
        </h1>
        <div className="text-white text-xl font-bold mb-1">
          Score: <span className="text-motus-yellow text-3xl ml-2">{score}</span>
        </div>
      </div>

      <div className="h-8 mb-4 flex justify-center w-full">
        {errorMsg && (
          <div className="bg-red-500 text-white px-4 py-1 rounded font-bold animate-pulse">
            {errorMsg}
          </div>
        )}
        {isCorrect && (
          <div className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold text-lg shadow-lg">
            Bravo ! Le mot était bien <span className="uppercase font-black">{solution}</span> 🎉
          </div>
        )}
      </div>

      <Grid
        currentGuess={currentGuess}
        guesses={guesses}
        turn={turn}
        wordLength={solution.length}
        shakeSignal={shakeSignal}
        isCorrect={isCorrect}
      />

      {!isGameOver && (
        <Keyboard usedKeys={usedKeys} handleKeyup={handleKeyup} />
      )}

      {(isGameOver && !isCorrect) && (
        <div className="result-panel mt-8 flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700 z-10">
          <p className="text-red-400 font-bold text-xl mb-4">
            Perdu... Le mot était <span className="text-white uppercase">{solution}</span>
          </p>
          <button
            onClick={handleReplay}
            className="bg-motus-blue text-white px-8 py-3 rounded font-bold uppercase tracking-wide hover:bg-blue-500 transition-colors shadow-lg cursor-pointer"
          >
            Recommencer (Score à 0)
          </button>
        </div>
      )}
    </div>
  );
}

export default App;