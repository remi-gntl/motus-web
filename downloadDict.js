import fs from 'fs';

const LEXIQUE_URL = 'http://www.lexique.org/databases/Lexique383/Lexique383.tsv';
const MIN_LEN = 5;
const MAX_LEN = 10;
const ANSWER_MIN_FREQ = 3;
const ANSWER_CGRAMS = new Set(['NOM', 'ADJ', 'VER', 'ADV']);

const normalize = (w) => w.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

async function generateDictionaries() {
  console.log("Téléchargement de Lexique383 (base CNRS)...");
  const response = await fetch(LEXIQUE_URL);
  const text = await response.text();
  const lines = text.split('\n').filter(Boolean);

  const header = lines[0].split('\t');
  const idx = (col) => header.indexOf(col);
  const iOrtho = idx('ortho');
  const iCgram = idx('cgram');
  const iFreq = idx('freqlivres');
  const iIslem = idx('islem');
  const iNbLettres = idx('nblettres');

  const rows = lines.slice(1).map(l => l.split('\t'));

  console.log("Dico RÉPONSES : mots courants, lemmes uniquement...");
  const answerWords = rows
    .filter(cols => {
      const nbLettres = parseInt(cols[iNbLettres], 10);
      return ANSWER_CGRAMS.has(cols[iCgram]) &&
        cols[iIslem] === '1' &&
        parseFloat(cols[iFreq]) >= ANSWER_MIN_FREQ &&
        nbLettres >= MIN_LEN && nbLettres <= MAX_LEN;
    })
    .map(cols => normalize(cols[iOrtho]))
    .filter(w => /^[A-Z]+$/.test(w));

  console.log("Dico VALIDATION : toutes formes, sans filtre de fréquence...");

  const validWords = rows
    .filter(cols => {
      const nbLettres = parseInt(cols[iNbLettres], 10);
      return nbLettres >= MIN_LEN && nbLettres <= MAX_LEN;
    })
    .map(cols => normalize(cols[iOrtho]))
    .filter(w => /^[A-Z]+$/.test(w));

  const uniqueAnswers = [...new Set(answerWords)];
  const uniqueValid = [...new Set([...validWords, ...uniqueAnswers])];

  fs.writeFileSync('./public/mots-reponses.txt', uniqueAnswers.join('\n'));
  fs.writeFileSync('./public/mots-valides.txt', uniqueValid.join('\n'));

  console.log(`${uniqueAnswers.length} mots-réponses sauvegardés dans public/mots-reponses.txt`);
  console.log(`${uniqueValid.length} mots valides sauvegardés dans public/mots-valides.txt`);
}

generateDictionaries().catch(err => console.error("Erreur :", err));