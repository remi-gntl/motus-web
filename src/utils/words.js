export let WORDS = ["BONJOUR"]; 

export const loadDictionary = async () => {
  try {
    const response = await fetch('/dictionnaire.txt');
    const text = await response.text();
    
    WORDS = text.split('\n').filter(w => w.length > 0);
      
    console.log(`${WORDS.length} mots chargés instantanément !`);
  } catch (error) {
    console.error("Erreur chargement dico :", error);
  }
};

export const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * WORDS.length);
  return WORDS[randomIndex];
};