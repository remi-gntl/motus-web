import { useState } from 'react';
import { checkGuess } from '../utils/gameLogic';
import { WORDS } from '../utils/words';

export default function useWordle(solution) {
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState(solution[0]);
  const [guesses, setGuesses] = useState([...Array(6)]);
  const [history, setHistory] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedKeys, setUsedKeys] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  const [knownLetters, setKnownLetters] = useState(() => {
    const initial = Array(solution.length).fill('');
    initial[0] = solution[0];
    return initial;
  });

  const formatGuess = () => {
    const formattedGuess = checkGuess(solution, currentGuess);
    
    setGuesses(prevGuesses => {
      let newGuesses = [...prevGuesses];
      newGuesses[turn] = formattedGuess;
      return newGuesses;
    });

    setHistory(prevHistory => [...prevHistory, currentGuess]);
    setTurn(prevTurn => prevTurn + 1);
    
    setUsedKeys(prevUsedKeys => {
      let newKeys = { ...prevUsedKeys };
      formattedGuess.forEach(l => {
        const currentColor = newKeys[l.letter];
        if (l.status === 'correct') newKeys[l.letter] = 'correct';
        else if (l.status === 'present' && currentColor !== 'correct') newKeys[l.letter] = 'present';
        else if (l.status === 'absent' && currentColor !== 'correct' && currentColor !== 'present') newKeys[l.letter] = 'absent';
      });
      return newKeys;
    });

    setKnownLetters(prevKnown => {
      const newKnown = [...prevKnown];
      formattedGuess.forEach((l, i) => {
        if (l.status === 'correct') {
          newKnown[i] = l.letter;
        }
      });
      return newKnown;
    });

    if (currentGuess === solution) {
      setIsCorrect(true);
    }
    
    setCurrentGuess(solution[0]); 
  };

  const handleKeyup = ({ key }) => {
    if (isCorrect || turn > 5) return;
    if (errorMsg) setErrorMsg('');

    if (key === 'Enter') {
      if (turn > 5) return;
      if (currentGuess.length !== solution.length) {
        setErrorMsg(`Le mot doit faire ${solution.length} lettres !`);
        return;
      }
      if (history.includes(currentGuess)) {
        setErrorMsg('Tu as déjà essayé ce mot !');
        return;
      }
      if (!WORDS.includes(currentGuess)) {
        setErrorMsg("Ce mot n'est pas dans notre dictionnaire !");
        return;
      }
      formatGuess();
    }

    if (key === 'Backspace') {
      if (currentGuess.length > 1) {
        setCurrentGuess(prev => prev.slice(0, -1));
      }
      return;
    }

    if (/^[A-Za-z]$/.test(key)) {
      if (currentGuess.length < solution.length) {
        setCurrentGuess(prev => prev + key.toUpperCase());
      }
    }
  };

  const resetGame = (newSolution) => {
    setTurn(0);
    setCurrentGuess(newSolution[0]);
    setGuesses([...Array(6)]);
    setHistory([]);
    setIsCorrect(false);
    setUsedKeys({});
    setErrorMsg('');
    
    const initialKnown = Array(newSolution.length).fill('');
    initialKnown[0] = newSolution[0];
    setKnownLetters(initialKnown);
  };

  return { turn, currentGuess, guesses, isCorrect, usedKeys, errorMsg, knownLetters, handleKeyup, resetGame };
}