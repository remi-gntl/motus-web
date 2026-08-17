export let ANSWER_WORDS = ["MOBILE"];
export let VALID_WORDS = new Set(["MOBILE"]);

export const loadDictionary = async () => {
  try {
    const [answersRes, validRes] = await Promise.all([
      fetch("/mots-reponses.txt"),
      fetch("/mots-valides.txt"),
    ]);
    const [answersText, validText] = await Promise.all([
      answersRes.text(),
      validRes.text(),
    ]);

    ANSWER_WORDS = answersText.split("\n").filter((w) => w.length > 0);
    VALID_WORDS = new Set(validText.split("\n").filter((w) => w.length > 0));

    console.log(
      `${ANSWER_WORDS.length} mots-réponses / ${VALID_WORDS.size} mots valides chargés.`,
    );
  } catch (error) {
    console.error("Erreur chargement dico :", error);
  }
};

export const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * ANSWER_WORDS.length);
  return ANSWER_WORDS[randomIndex];
};

export const isValidWord = (word) => VALID_WORDS.has(word);
