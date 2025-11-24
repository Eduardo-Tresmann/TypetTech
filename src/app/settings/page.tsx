'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSupabase, hasSupabaseConfig } from '@/lib/supabaseClient';
import { translateError } from '@/lib/errorMessages';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import { useGameConfig } from '@/hooks/useGameConfig';
import { useSound } from '@/hooks/useSound';
import { SoundService } from '@/core/services/SoundService';

export default function SettingsPage() {
  const { user } = useAuth();
  const { 
    config, 
    setSoundEnabled,
    setTypingSoundEnabled,
    setInterfaceSoundEnabled
  } = useGameConfig();
  const { playClick } = useSound();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleChangePassword = async () => {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      if (!user) throw new Error('Usuário não autenticado.');
      if (!hasSupabaseConfig()) throw new Error('Supabase não configurado.');
      if (!currentPassword || !newPassword || !confirmPassword)
        throw new Error('Preencha todos os campos.');
      if (newPassword.length < 6) throw new Error('A nova senha deve ter ao menos 6 caracteres.');
      if (newPassword !== confirmPassword) throw new Error('A confirmação da senha não coincide.');

      const supabase = getSupabase();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email as string,
        password: currentPassword,
      });
      if (signInError) throw new Error('Senha atual incorreta.');

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;

      setInfo('Senha alterada com sucesso. Faça login novamente com a nova senha.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      setError(translateError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#323437] flex items-center justify-center px-4 sm:px-6 py-4 pt-20 sm:pt-4">
      <div className="w-full max-w-md">
        <div className="mb-5">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h1 className="text-white text-xl sm:text-2xl font-bold">Configurações</h1>
            <Link href="/home" className="text-[#e2b714] text-sm sm:text-base">
              Voltar
            </Link>
          </div>
          <p className="text-[#d1d1d1] text-xs sm:text-sm">Gerencie suas preferências e configurações</p>
        </div>

        {/* Seção de Preferências de Jogo */}
        <div className="bg-[#2b2d2f] rounded-xl border border-[#3a3c3f] p-4 sm:p-6 text-white shadow-xl mb-4">
          <h2 className="text-white text-lg sm:text-xl font-semibold mb-5 sm:mb-4">Preferências de Áudio</h2>
          <div className="space-y-0">
            {/* Som de Digitação */}
            <button
              onClick={() => {
                playClick();
                setTypingSoundEnabled(!config.typingSoundEnabled);
              }}
              className="w-full flex items-center justify-between py-4 sm:py-3 px-0 hover:bg-[#323437]/50 rounded-lg transition-colors active:bg-[#323437]/70 -mx-1 px-1"
              role="switch"
              aria-checked={config.typingSoundEnabled}
              aria-label="Ativar som de digitação"
            >
              <div className="flex-1 pr-4">
                <label className="block text-[#d1d1d1] text-base sm:text-sm font-medium mb-1.5 sm:mb-1 cursor-pointer">
                  Som de Digitação
                </label>
                <p className="text-[#6b6e70] text-xs sm:text-xs leading-relaxed">
                  Sons ao digitar corretamente ou incorretamente
                </p>
              </div>
              <div className="flex-shrink-0">
                <div
                  className={`relative inline-flex h-7 w-12 sm:h-6 sm:w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#e2b714] focus:ring-offset-2 focus:ring-offset-[#2b2d2f] ${
                    config.typingSoundEnabled ? 'bg-[#e2b714] shadow-lg shadow-[#e2b714]/30' : 'bg-[#3a3c3f]'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 sm:h-4 sm:w-4 transform rounded-full bg-white transition-all duration-200 shadow-md ${
                      config.typingSoundEnabled ? 'translate-x-6 sm:translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
              </div>
            </button>

            <div className="border-t border-[#3a3c3f] my-1"></div>

            {/* Som de Interface */}
              <button
                onClick={() => {
                  const newValue = !config.interfaceSoundEnabled;
                  setInterfaceSoundEnabled(newValue);
                  // Tocar som apenas se estiver ativando (não quando desativando)
                  if (newValue) {
                    // Usar setTimeout para garantir que o SoundService foi atualizado pelo contexto
                    setTimeout(() => {
                      playClick();
                    }, 50);
                  }
                }}
              className="w-full flex items-center justify-between py-4 sm:py-3 px-0 hover:bg-[#323437]/50 rounded-lg transition-colors active:bg-[#323437]/70 -mx-1 px-1"
              role="switch"
              aria-checked={config.interfaceSoundEnabled}
              aria-label="Ativar som de interface"
            >
              <div className="flex-1 pr-4">
                <label className="block text-[#d1d1d1] text-base sm:text-sm font-medium mb-1.5 sm:mb-1 cursor-pointer">
                  Som de Interface
                </label>
                <p className="text-[#6b6e70] text-xs sm:text-xs leading-relaxed">
                  Sons ao clicar em botões, links e menus
                </p>
              </div>
              <div className="flex-shrink-0">
                <div
                  className={`relative inline-flex h-7 w-12 sm:h-6 sm:w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#e2b714] focus:ring-offset-2 focus:ring-offset-[#2b2d2f] ${
                    config.interfaceSoundEnabled ? 'bg-[#e2b714] shadow-lg shadow-[#e2b714]/30' : 'bg-[#3a3c3f]'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 sm:h-4 sm:w-4 transform rounded-full bg-white transition-all duration-200 shadow-md ${
                      config.interfaceSoundEnabled ? 'translate-x-6 sm:translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Seção de Alteração de Senha */}
        <div className="bg-[#2b2d2f] rounded-xl border border-[#3a3c3f] p-4 sm:p-6 text-white shadow-xl">
          <h2 className="text-white text-lg sm:text-xl font-semibold mb-4">Alterar Senha</h2>
          <div className="space-y-4 sm:space-y-3">
            <div>
              <label className="block text-[#d1d1d1] text-sm font-medium mb-1.5">Senha atual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full p-3 sm:p-3.5 rounded-lg bg-[#1f2022] text-white outline-none border border-[#3a3c3f] focus:border-[#e2b714] focus:ring-2 focus:ring-[#e2b714]/20 transition-all text-base sm:text-sm"
                placeholder="Digite sua senha atual"
              />
            </div>

            <div>
              <label className="block text-[#d1d1d1] text-sm font-medium mb-1.5">Nova senha</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full p-3 sm:p-3.5 rounded-lg bg-[#1f2022] text-white outline-none border border-[#3a3c3f] focus:border-[#e2b714] focus:ring-2 focus:ring-[#e2b714]/20 transition-all text-base sm:text-sm"
                placeholder="Digite a nova senha (mín. 6 caracteres)"
              />
            </div>

            <div>
              <label className="block text-[#d1d1d1] text-sm font-medium mb-1.5">
                Confirmar nova senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full p-3 sm:p-3.5 rounded-lg bg-[#1f2022] text-white outline-none border border-[#3a3c3f] focus:border-[#e2b714] focus:ring-2 focus:ring-[#e2b714]/20 transition-all text-base sm:text-sm"
                placeholder="Repita a nova senha"
              />
            </div>

            {/* Mensagens de erro/sucesso */}
            {(error || info) && (
              <div>
                {error && (
                  <div className="p-3.5 bg-[#ca4754]/10 border border-[#ca4754]/30 rounded-lg text-[#ca4754] text-sm flex items-center gap-2.5">
                    <svg
                      className="w-4.5 h-4.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="break-words">{error}</span>
                  </div>
                )}
                {!error && info && (
                  <div className="p-3.5 bg-[#e2b714]/10 border border-[#e2b714]/30 rounded-lg text-[#e2b714] text-sm flex items-center gap-2.5">
                    <svg
                      className="w-4.5 h-4.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="break-words">{info}</span>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => {
                  playClick();
                  handleChangePassword();
                }}
                disabled={loading}
                className="w-full py-3.5 sm:py-3 px-6 bg-[#e2b714] text-black rounded-lg hover:bg-[#d4c013] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl disabled:shadow-none text-base sm:text-sm min-h-[44px]"
              >
                {loading && (
                  <LoadingSpinner size="sm" className="border-black border-t-transparent" />
                )}
                {loading ? 'Processando...' : 'Trocar senha'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
