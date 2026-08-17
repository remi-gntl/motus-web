import { useState } from "react";
import { checkGuess } from "../utils/gameLogic";
import { isValidWord } from "../utils/words";

const buildInitialState = (solution) => {
  const arr = Array(solution.length).fill("");
  arr[0] = solution[0];
  return arr;
};

export default function useWordle(solution) {
  const [turn, setTurn] = useState(0);
  const [guesses, setGuesses] = useState([...Array(6)]);
  const [history, setHistory] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedKeys, setUsedKeys] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [shakeSignal, setShakeSignal] = useState(0);
  const [knownLetters, setKnownLetters] = useState(() =>
    buildInitialState(solution),
  );
  const [currentGuess, setCurrentGuess] = useState(() =>
    buildInitialState(solution),
  );

  const isEditable = (i) => i !== 0;
  const triggerShake = () => setShakeSignal((s) => s + 1);

  const formatGuess = () => {
    const guessString = currentGuess.join("");
    const formattedGuess = checkGuess(solution, guessString);

    setGuesses((prev) => {
      const newGuesses = [...prev];
      newGuesses[turn] = formattedGuess;
      return newGuesses;
    });

    setHistory((prev) => [...prev, guessString]);
    setUsedKeys((prev) => {
      const newKeys = { ...prev };
      formattedGuess.forEach((l) => {
        const currentColor = newKeys[l.letter];
        if (l.status === "correct") newKeys[l.letter] = "correct";
        else if (l.status === "present" && currentColor !== "correct")
          newKeys[l.letter] = "present";
        else if (
          l.status === "absent" &&
          currentColor !== "correct" &&
          currentColor !== "present"
        )
          newKeys[l.letter] = "absent";
      });
      return newKeys;
    });

    const newKnown = [...knownLetters];
    formattedGuess.forEach((l, i) => {
      if (l.status === "correct") newKnown[i] = l.letter;
    });
    setKnownLetters(newKnown);

    if (guessString === solution) {
      setIsCorrect(true);
    } else {
      setCurrentGuess(newKnown.map((l) => l || ""));
      setTurn((prev) => prev + 1);
    }
  };

  const handleKeyup = ({ key }) => {
    if (isCorrect || turn > 5) return;
    if (errorMsg) setErrorMsg("");

    if (key === "Enter") {
      const guessString = currentGuess.join("");
      if (currentGuess.some((l) => !l)) {
        setErrorMsg("Complète le mot avant de valider !");
        triggerShake();
        return;
      }
      if (history.includes(guessString)) {
        setErrorMsg("Tu as déjà essayé ce mot !");
        triggerShake();
        return;
      }
      if (!isValidWord(guessString)) {
        setErrorMsg("Ce mot n'est pas dans notre dictionnaire !");
        triggerShake();
        return;
      }
      formatGuess();
      return;
    }

    if (key === "Backspace") {
      const editableFilled = currentGuess
        .map((l, i) => ({ l, i }))
        .filter(({ l, i }) => isEditable(i) && l);
      const last = editableFilled[editableFilled.length - 1];
      if (last) {
        const newGuess = [...currentGuess];
        newGuess[last.i] = "";
        setCurrentGuess(newGuess);
      }
      return;
    }

    if (/^[A-Za-z]$/.test(key)) {
      const firstEmpty = currentGuess.findIndex((l, i) => isEditable(i) && !l);
      if (firstEmpty !== -1) {
        const newGuess = [...currentGuess];
        newGuess[firstEmpty] = key.toUpperCase();
        setCurrentGuess(newGuess);
      }
    }
  };

  return {
    turn,
    currentGuess,
    guesses,
    isCorrect,
    usedKeys,
    errorMsg,
    shakeSignal,
    handleKeyup,
  };
}
