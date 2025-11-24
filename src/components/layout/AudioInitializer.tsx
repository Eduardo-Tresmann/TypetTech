'use client';

import { useEffect, useRef } from 'react';

/**
 * Componente que inicializa o AudioContext na primeira interação do usuário
 * Necessário especialmente no iOS, onde o AudioContext precisa ser "desbloqueado"
 * 
 * Este componente cria um AudioContext global que pode ser usado por todos os SoundServices
 */
export default function AudioInitializer() {
  const initializedRef = useRef(false);
  const contextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (initializedRef.current) return;
    
    const initializeAudio = async () => {
      if (initializedRef.current) return;
      initializedRef.current = true;
      
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) {
          return;
        }

        // Criar um AudioContext para "desbloquear" o áudio
        const context = new AudioContextClass();
        contextRef.current = context;
        
        // Se estiver suspenso, tentar resumir
        if (context.state === 'suspended') {
          try {
            await context.resume();
          } catch (error) {
            console.debug('Não foi possível resumir AudioContext na inicialização:', error);
          }
        }
        
        // Criar um oscilador silencioso muito curto para ativar o contexto
        // Isso garante que o contexto esteja "desbloqueado" no mobile
        try {
          const oscillator = context.createOscillator();
          const gainNode = context.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(context.destination);
          
          // Volume zero para ser silencioso
          gainNode.gain.setValueAtTime(0, context.currentTime);
          oscillator.start(context.currentTime);
          oscillator.stop(context.currentTime + 0.001);
        } catch (error) {
          console.debug('Erro ao criar oscilador de inicialização:', error);
        }
        
        // Armazenar o contexto globalmente para uso posterior
        (window as any).__typetechAudioContext = context;
        
        // Disparar evento para notificar que o áudio foi inicializado
        // Aguardar um pouco para garantir que o contexto esteja realmente pronto
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('typetech:audioInitialized'));
        }, 50);
        
      } catch (error) {
        console.debug('AudioContext não pôde ser inicializado:', error);
        initializedRef.current = false; // Permitir nova tentativa
      }
    };

    // Listener para primeira interação do usuário
    const handleFirstInteraction = async (e: Event) => {
      // Prevenir comportamento padrão apenas para garantir que a interação seja registrada
      if (!initializedRef.current) {
        await initializeAudio();
      }
    };

    // Adicionar listeners para vários tipos de interação
    // Usar capture phase para pegar o evento mais cedo
    const events = ['touchstart', 'touchend', 'mousedown', 'keydown', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, { 
        once: true, 
        passive: true,
        capture: true 
      });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction, { capture: true });
      });
      
      // Limpar contexto ao desmontar
      if (contextRef.current) {
        contextRef.current.close().catch(() => {});
        contextRef.current = null;
      }
      delete (window as any).__typetechAudioContext;
    };
  }, []);

  return null;
}

