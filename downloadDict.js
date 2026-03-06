// downloadDict.js
import fs from 'fs';

async function generateDictionary() {
  console.log("📥 Téléchargement du dictionnaire brut depuis GitHub...");
  
  try {
    // On télécharge la liste complète Gutenberg (OpenLexicon)
    const response = await fetch('https://raw.githubusercontent.com/chrplr/openlexicon/master/datasets-info/Liste-de-mots-francais-Gutenberg/liste.de.mots.francais.frgut.txt');
    const text = await response.text();
    
    console.log("🧹 Nettoyage et formatage des mots...");
    
    const words = text.split('\n')
      // Mise en majuscules et suppression des accents
      .map(w => w.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
      // On ne garde que les mots de 5 à 10 lettres contenant uniquement des lettres de A à Z (pas de tirets)
      .filter(w => w.length >= 5 && w.length <= 10 && /^[A-Z]+$/.test(w));
      
    // En supprimant les accents, "été" et "ete" deviennent "ETE". On utilise un Set pour retirer les doublons.
    const uniqueWords = [...new Set(words)];

    // On écrit le résultat propre dans le dossier public
    fs.writeFileSync('./public/dictionnaire.txt', uniqueWords.join('\n'));
    
    console.log(`✅ Terminé ! ${uniqueWords.length} mots parfaits pour Motus ont été sauvegardés dans public/dictionnaire.txt.`);
  } catch (error) {
    console.error("❌ Erreur :", error);
  }
}

generateDictionary();