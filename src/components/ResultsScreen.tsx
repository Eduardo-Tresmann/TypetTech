import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ResetButton from '@/components/ResetButton';

interface ResultsScreenProps {
  wpm: number;
  accuracy: number;
  correctLetters: number;
  incorrectLetters: number;
  resetTest: () => void;
  resetKey: number;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  wpm,
  accuracy,
  correctLetters,
  incorrectLetters,
  resetTest,
  resetKey,
}) => {
  const { user } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="text-center space-y-6 sm:space-y-8">
        <div className="space-y-2">
          <div className="text-yellow-400 text-4xl sm:text-5xl md:text-6xl font-bold">{wpm}</div>
          <div className="text-white text-xl sm:text-2xl font-light">WPM</div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 md:gap-8">
          <div className="text-center space-y-1">
            <div className="text-yellow-400 text-xl sm:text-2xl">{accuracy}%</div>
            <div className="text-white text-base sm:text-lg font-light">Precisão</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-yellow-400 text-xl sm:text-2xl">{correctLetters}</div>
            <div className="text-white text-base sm:text-lg font-light">Acertos</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-yellow-400 text-xl sm:text-2xl">{incorrectLetters}</div>
            <div className="text-white text-base sm:text-lg font-light">Erros</div>
          </div>
        </div>
        {!user && (
          <div className="max-w-[60ch] mx-auto px-2">
            <div className="rounded-xl border border-[#3a3c3f] bg-[#2b2d2f]/60 backdrop-blur-sm px-4 sm:px-5 py-4 space-y-3">
              <div className="flex items-center justify-center gap-2 text-[#d1d1d1] text-xs sm:text-sm">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2l3 7h7l-6 4 3 7-6-4-6 4 3-7-6-4h7l3-7z"
                    stroke="#e2b714"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Salve seus resultados e entre no ranking</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center min-h-[44px] px-6 sm:px-4 rounded-full text-sm sm:text-base transition-colors bg-[#e2b714] text-black hover:bg-[#d4c013] w-full sm:w-auto"
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center min-h-[44px] px-6 sm:px-4 rounded-full text-sm sm:text-base transition-colors border border-[#3a3c3f] text-[#d1d1d1] hover:bg-[#2b2d2f] w-full sm:w-auto"
                >
                  Registrar
                </Link>
              </div>
            </div>
          </div>
        )}
        <div className="pt-4" key={`button-${resetKey}`}>
          <ResetButton
            text="Reiniciar"
            onClick={resetTest}
            className="py-3 px-6 sm:py-2 sm:px-4 text-base sm:text-lg bg-[#e2b714] text-black rounded hover:bg-[#d4c013] transition-colors min-h-[44px] min-w-[44px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
