import { WORDS } from '../constants/words';

export const generateText = (wordCount: number = 100): string => {
  const selectedWords = [];
  for (let i = 0; i < wordCount; i++) {
    selectedWords.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  return selectedWords.join(' ');
};

export const getLines = (txt: string, max: number) => {
  const words = txt.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  for (const word of words) {
    const space = currentLine ? ' ' : '';
    const testLine = currentLine + space + word;
    if (testLine.length > max) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        lines.push(word);
        currentLine = '';
      }
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
};

export const calculateFinalStats = (
  userInput: string,
  text: string,
  totalTimeInSeconds: number,
  setFinalWordsTyped: (value: number) => void,
  setCorrectLetters: (value: number) => void,
  setIncorrectLetters: (value: number) => void,
  setAccuracy: (value: number) => void,
  setWpm: (value: number) => void
) => {
  const charsTyped = userInput.length;
  setFinalWordsTyped(Math.round(charsTyped / 5));

  const correctChars = userInput.split('').filter((char, index) => char === text[index]).length;
  const incorrectChars = userInput.length - correctChars;
  setCorrectLetters(correctChars);
  setIncorrectLetters(incorrectChars);

  const finalAccuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;
  setAccuracy(finalAccuracy);

  const elapsedTimeInMinutes = totalTimeInSeconds / 60;
  const finalWpm = elapsedTimeInMinutes > 0 ? Math.round((correctChars / 5) / elapsedTimeInMinutes) : 0;
  setWpm(finalWpm);
};
