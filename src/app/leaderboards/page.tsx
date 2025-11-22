'use client';
import React, { useEffect, useState } from 'react';
import ModeBar from '@/components/ModeBar';
import { fetchLeaderboard } from '@/lib/db';

type Row = {
  wpm: number;
  accuracy: number;
  total_time: number;
  created_at: string;
  user_id: string;
  profiles?: { display_name: string | null; avatar_url: string | null } | null;
};

export default function LeaderboardsPage() {
  const [selected, setSelected] = useState(15);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const { data } = await fetchLeaderboard(selected, 50);
      setRows((data as Row[]) ?? []);
      setLoading(false);
    };
    run();
  }, [selected]);

  return (
    <div className="min-h-screen bg-[#323437] flex flex-col items-center justify-start">
      <div className="mt-14 w-full flex justify-center">
        <div className="w-full max-w-[110ch] md:max-w-[140ch] lg:max-w-[175ch] xl:max-w-[200ch] 2xl:max-w-[220ch] mx-auto px-6 sm:px-8 lg:px-12">
          <ModeBar totalTime={selected} onSelectTime={setSelected} />
        </div>
      </div>

      <div className="w-full max-w-[110ch] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-[#2c2e31] rounded p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">Top WPM • {selected}s</h2>
          {loading ? (
            <div className="text-[#d1d1d1]">Carregando...</div>
          ) : rows.length === 0 ? (
            <div className="text-[#d1d1d1]">Nenhum resultado ainda.</div>
          ) : (
            <div className="space-y-2">
              {rows.map((r, idx) => (
                <div key={`${r.user_id}-${r.created_at}`} className="flex items-center gap-4 py-2">
                  <div className="w-8 text-[#d1d1d1]">{idx + 1}</div>
                  {r.profiles?.avatar_url ? (
                    <img src={r.profiles.avatar_url!} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#e2b714] text-black flex items-center justify-center text-xs font-semibold">
                      {(r.profiles?.display_name ?? 'US').slice(0,2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-white">{r.profiles?.display_name ?? 'Usuário'}</div>
                    <div className="text-[#6b6e70] text-sm">{new Date(r.created_at).toLocaleString()}</div>
                  </div>
                  <div className="text-yellow-400 text-xl font-bold w-20 text-right">{r.wpm}</div>
                  <div className="text-[#d1d1d1] w-24 text-right">{r.accuracy}%</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
