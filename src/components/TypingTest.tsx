'use client';

import { useState, useEffect, useRef } from 'react';

const WORDS = [
  'o', 'a', 'e', 'de', 'do', 'da', 'em', 'um', 'para', 'com',
  'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos',
  'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'à', 'seu', 'sua',
  'quando', 'muito', 'há', 'nos', 'já', 'está', 'eu', 'também', 'só', 'pelo',
  'pela', 'até', 'isso', 'ela', 'entre', 'era', 'depois', 'sem', 'mesmo', 'aos',
  'ter', 'seus', 'quem', 'nas', 'me', 'esse', 'eles', 'estão', 'você', 'tinha',
  'foram', 'essa', 'num', 'nem', 'suas', 'meu', 'às', 'minha', 'têm', 'numa',
  'pelos', 'elas', 'havia', 'seja', 'qual', 'será', 'nós', 'tenho', 'lhe', 'deles',
  'essas', 'esses', 'pelas', 'este', 'fosse', 'dele', 'tu', 'te', 'vocês', 'vos',
  'lhes', 'meus', 'minhas', 'teu', 'tua', 'teus', 'tuas', 'nosso', 'nossa', 'nossos',
  'nossas', 'dela', 'delas', 'esta', 'estes', 'estas', 'aquele', 'aquela', 'aqueles', 'aquelas'
];

const generateText = (wordCount: number = 50): string => {
  const selectedWords = [];
  for (let i = 0; i < wordCount; i++) {
    selectedWords.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  return selectedWords.join(' ');
};

export default function TypingTest() {
  const [text, setText] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText(generateText());
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsFinished(true);
      calculateFinalStats();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isActive && startTime) {
      const elapsedTime = (Date.now() - startTime) / 1000 / 60; // in minutes
      const wordsTyped = userInput.trim().split(' ').length;
      const currentWpm = Math.round(wordsTyped / elapsedTime);
      setWpm(currentWpm);

      const correctChars = userInput.split('').filter((char, index) => char === text[index]).length;
      const currentAccuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;
      setAccuracy(currentAccuracy);
    }
  }, [userInput, isActive, startTime, text]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isActive && value.length > 0) {
      setIsActive(true);
      setStartTime(Date.now());
    }
    setUserInput(value);
    setCurrentIndex(value.length);
  };

  const calculateFinalStats = () => {
    const elapsedTime = (Date.now() - (startTime || Date.now())) / 1000 / 60;
    const wordsTyped = userInput.trim().split(' ').length;
    const finalWpm = Math.round(wordsTyped / elapsedTime);
    setWpm(finalWpm);

    const correctChars = userInput.split('').filter((char, index) => char === text[index]).length;
    const finalAccuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;
    setAccuracy(finalAccuracy);
  };

  const resetTest = () => {
    setText(generateText());
    setUserInput('');
    setCurrentIndex(0);
    setStartTime(null);
    setTimeLeft(60);
    setIsActive(false);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    inputRef.current?.focus();
  };

  const renderText = () => {
    return text.split('').map((char, index) => {
      let className = 'text-gray-400';
      if (index < userInput.length) {
        className = userInput[index] === char ? 'text-green-400' : 'text-red-400';
      } else if (index === currentIndex) {
        className = 'bg-cyan-600 text-white';
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-4xl w-full border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Teste de Digitação</h1>

        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-semibold text-gray-300">
            Tempo: <span className="text-cyan-400">{timeLeft}s</span>
          </div>
          <div className="text-lg font-semibold text-gray-300">
            WPM: <span className="text-green-400">{wpm}</span>
          </div>
          <div className="text-lg font-semibold text-gray-300">
            Precisão: <span className="text-purple-400">{accuracy}%</span>
          </div>
        </div>

        <div className="bg-gray-700 p-6 rounded-lg mb-6 min-h-[200px] text-xl leading-relaxed font-mono border border-gray-600">
          {renderText()}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          disabled={isFinished}
          className="w-full p-4 text-xl bg-gray-700 border-2 border-gray-600 rounded-lg focus:border-cyan-400 focus:outline-none mb-6 text-white placeholder-gray-400"
          placeholder="Comece a digitar aqui..."
          autoFocus
        />

        {isFinished && (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Resultado Final</h2>
            <p className="text-lg text-gray-300">WPM: <span className="font-semibold text-green-400">{wpm}</span></p>
            <p className="text-lg text-gray-300">Precisão: <span className="font-semibold text-purple-400">{accuracy}%</span></p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={resetTest}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 border border-cyan-500"
          >
            Reiniciar Teste
          </button>
        </div>
      </div>
    </div>
  );
}
