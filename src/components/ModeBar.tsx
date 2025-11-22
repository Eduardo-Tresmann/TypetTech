import React from 'react';

interface ModeBarProps {
  totalTime: number;
  onSelectTime: (seconds: number) => void;
}

const times = [15, 30, 60, 120];

export default function ModeBar({ totalTime, onSelectTime }: ModeBarProps) {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="inline-flex items-center gap-6 px-5 py-2 rounded-full bg-[#2c2e31]">
        {times.map((t) => (
          <button
            key={t}
            onClick={() => onSelectTime(t)}
            className={`text-sm transition-colors ${
              totalTime === t ? 'text-[#e2b714] font-semibold' : 'text-[#6b6e70] hover:text-[#e2b714]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
