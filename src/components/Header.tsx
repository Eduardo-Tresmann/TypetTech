"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getSupabase, hasSupabaseConfig } from '@/lib/supabaseClient';

const Header: React.FC = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('profile.display_name');
      return cached || null;
    }
    return null;
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('profile.avatar_url');
      return cached || null;
    }
    return null;
  });
  const initials = (displayName ?? (user?.email as string | undefined)?.split('@')[0] ?? 'US').slice(0, 2).toUpperCase();

  useEffect(() => {
    const load = async () => {
      if (!user || !hasSupabaseConfig()) return;
      const supabase = getSupabase();
      const { data } = await supabase.from('profiles').select('display_name, avatar_url').eq('id', user.id).maybeSingle();
      const dn = data?.display_name ?? null;
      const au = data?.avatar_url ?? null;
      setDisplayName(dn);
      setAvatarUrl(au);
      if (typeof window !== 'undefined') {
        if (dn) localStorage.setItem('profile.display_name', dn);
        if (au) localStorage.setItem('profile.avatar_url', au);
      }
    };
    load();
  }, [user]);

  return (
    <div className="flex justify-center items-center h-14 bg-[#323437]">
      <div className="w-full max-w-[110ch] md:max-w-[140ch] lg:max-w-[175ch] xl:max-w-[200ch] 2xl:max-w-[220ch] mx-auto px-10 sm:px-16 md:px-24 lg:px-32 xl:px-40">
        <div className="grid grid-cols-3 items-center">
          <div className="justify-self-start">
            <Link href="/home" className="flex items-center gap-2 text-white text-3xl font-bold hover:text-[#e2b714] transition-colors">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="#e2b714" strokeWidth="2"/>
                <path d="M6 9h2M10 9h2M14 9h2M6 13h2M10 13h2M14 13h2" stroke="#e2b714" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              TypeTech
            </Link>
          </div>
          <div className="justify-self-center">
            <Link href="/leaderboards" className="flex items-center gap-2 text-white text-lg font-semibold tracking-wide hover:text-[#e2b714] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 18h18" stroke="#e2b714" strokeWidth="2" strokeLinecap="round"/>
                <path d="M5 18l2-9 5 4 5-7 2 12" stroke="#e2b714" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Leaderboards
            </Link>
          </div>
          <div className="justify-self-end">
            {!user ? (
              <Link href="/auth/login" className="py-2 px-4 text-lg bg-[#e2b714] text-black rounded hover:bg-[#d4c013] transition-colors">
                Entrar
              </Link>
            ) : (
              <Link href="/profile" className="flex items-center gap-3">
                <span className="text-white hover:underline">
                  {displayName ?? (user.email as string).split('@')[0]}
                </span>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#e2b714] text-black flex items-center justify-center font-semibold">
                    {initials}
                  </div>
                )}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;