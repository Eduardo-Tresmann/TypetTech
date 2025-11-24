import React from 'react';
import { useSound } from '@/hooks/useSound';

interface ResetButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
}

const ResetButton: React.FC<ResetButtonProps> = ({ text, onClick, className = '' }) => {
  const { playClick } = useSound();
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClick();
    onClick();
    e.currentTarget.blur();
  };

  return (
    <button
      onClick={handleClick}
      className={`bg-[#e2b714] hover:bg-[#f4d03f] text-[#323437] font-bold rounded transition duration-300 min-h-[44px] min-w-[44px] ${className}`}
    >
      {text}
    </button>
  );
};

export default ResetButton;
