/**
 * Hook para facilitar o uso de sons em componentes
 * Gerencia instância única do SoundService e fornece métodos convenientes
 */

import { useRef, useEffect } from 'react';
import { SoundService } from '@/core/services/SoundService';
import { useGameConfig } from './useGameConfig';
import { GameConfig } from '@/core/types';

export function useSound() {
  const { config } = useGameConfig();
  const soundServiceRef = useRef<SoundService | null>(null);

  // Inicializar ou atualizar SoundService quando configurações mudarem
  useEffect(() => {
    if (!soundServiceRef.current) {
      soundServiceRef.current = new SoundService(config.interfaceSoundEnabled, config.interfaceVolume);
    } else {
      soundServiceRef.current.setEnabled(config.interfaceSoundEnabled);
      soundServiceRef.current.setVolume(config.interfaceVolume);
    }
  }, [config.interfaceSoundEnabled, config.interfaceVolume]);

  // Ouvir evento de atualização de configuração para atualização imediata
  useEffect(() => {
    const handleConfigUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<GameConfig>;
      const updatedConfig = customEvent.detail;
      if (soundServiceRef.current && updatedConfig) {
        soundServiceRef.current.setEnabled(updatedConfig.interfaceSoundEnabled);
        soundServiceRef.current.setVolume(updatedConfig.interfaceVolume);
      }
    };

    window.addEventListener('typetech:configUpdated', handleConfigUpdate);
    return () => {
      window.removeEventListener('typetech:configUpdated', handleConfigUpdate);
    };
  }, []);

  const playClick = () => {
    // O SoundService já verifica se está habilitado internamente
    soundServiceRef.current?.playClick();
  };

  const playMenuToggle = () => {
    // O SoundService já verifica se está habilitado internamente
    soundServiceRef.current?.playMenuToggle();
  };

  const playHover = () => {
    // O SoundService já verifica se está habilitado internamente
    soundServiceRef.current?.playHover();
  };

  const playCorrect = () => {
    soundServiceRef.current?.playCorrect();
  };

  const playIncorrect = () => {
    soundServiceRef.current?.playIncorrect();
  };

  return {
    playClick,
    playMenuToggle,
    playHover,
    playCorrect,
    playIncorrect,
    isEnabled: config.soundEnabled,
  };
}

