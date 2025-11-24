/**
 * Serviço de feedback sonoro
 * Gerencia sons para acertos, erros e interações
 */

export class SoundService {
  private enabled: boolean;
  private volume: number;
  private audioContext: AudioContext | null = null;
  private initializationPromise: Promise<AudioContext | null> | null = null;

  constructor(enabled: boolean = true, volume: number = 0.5) {
    this.enabled = enabled;
    this.volume = volume;
    // Não inicializar o AudioContext no construtor - será criado lazy quando necessário
  }

  /**
   * Garante que o AudioContext esteja pronto para tocar (especialmente importante no mobile)
   * Usa lazy initialization e tenta resumir se estiver suspenso
   */
  private async ensureAudioContextReady(): Promise<AudioContext | null> {
    if (!this.enabled) return null;

    // Se já temos um contexto em execução, retornar
    if (this.audioContext && this.audioContext.state === 'running') {
      return this.audioContext;
    }

    // Se já estamos inicializando, aguardar
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    // Criar nova promise de inicialização
    this.initializationPromise = (async () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) {
          return null;
        }

        // Tentar usar o contexto global criado pelo AudioInitializer primeiro
        const globalContext = (window as any).__typetechAudioContext as AudioContext | undefined;
        if (globalContext && globalContext.state !== 'closed') {
          this.audioContext = globalContext;
          
          // Se estiver suspenso, tentar resumir
          if (this.audioContext.state === 'suspended') {
            try {
              await this.audioContext.resume();
            } catch (error) {
              // Se falhar, criar um novo contexto
              this.audioContext = new AudioContextClass();
              if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
              }
            }
          }
          
          return this.audioContext;
        }

        // Se não houver contexto global, criar novo contexto
        if (!this.audioContext || this.audioContext.state === 'closed') {
          this.audioContext = new AudioContextClass();
        }

        // No mobile, o AudioContext geralmente começa suspenso
        if (this.audioContext.state === 'suspended') {
          try {
            // Tentar resumir - isso pode falhar se não houver interação do usuário
            await this.audioContext.resume();
          } catch (error) {
            // Se falhar ao resumir, criar um novo contexto
            try {
              if (this.audioContext !== globalContext) {
                this.audioContext.close().catch(() => {});
              }
            } catch (e) {
              // Ignorar erros ao fechar
            }
            this.audioContext = new AudioContextClass();
            
            // Tentar resumir o novo contexto
            if (this.audioContext.state === 'suspended') {
              await this.audioContext.resume();
            }
          }
        }

        return this.audioContext;
      } catch (error) {
        console.warn('Erro ao inicializar AudioContext:', error);
        return null;
      } finally {
        this.initializationPromise = null;
      }
    })();

    return this.initializationPromise;
  }

  /**
   * Toca som de acerto
   */
  playCorrect(): void {
    if (!this.enabled) return;
    
    this.ensureAudioContextReady().then((audioContext) => {
      if (!audioContext) return;

      try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800; // Tom agudo para acerto
        oscillator.type = 'sine';

        const baseGain = 0.08 * this.volume;
        gainNode.gain.setValueAtTime(baseGain, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01 * this.volume, audioContext.currentTime + 0.08);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.08);
      } catch (error) {
        console.warn('Erro ao tocar som de acerto:', error);
      }
    }).catch(() => {
      // Silenciosamente falhar se não conseguir inicializar
    });
  }

  /**
   * Toca som de erro
   */
  playIncorrect(): void {
    if (!this.enabled) return;
    
    this.ensureAudioContextReady().then((audioContext) => {
      if (!audioContext) return;

      try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 200; // Tom grave para erro
        oscillator.type = 'sawtooth';

        const baseGain = 0.12 * this.volume;
        gainNode.gain.setValueAtTime(baseGain, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01 * this.volume, audioContext.currentTime + 0.12);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.12);
      } catch (error) {
        console.warn('Erro ao tocar som de erro:', error);
      }
    }).catch(() => {
      // Silenciosamente falhar se não conseguir inicializar
    });
  }

  /**
   * Habilita ou desabilita sons
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Define o volume (0.0 a 1.0)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Verifica se os sons estão habilitados
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Obtém o volume atual
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * Força a inicialização do AudioContext (útil para mobile)
   * Deve ser chamado após uma interação do usuário
   */
  async initialize(): Promise<void> {
    await this.ensureAudioContextReady();
  }

  /**
   * Toca som de clique/interação (botões, links, menus)
   * Tenta uma abordagem mais direta para mobile
   */
  playClick(): void {
    if (!this.enabled) return;
    
    // Tentar abordagem síncrona primeiro (pode funcionar se o contexto já estiver pronto)
    if (this.audioContext && this.audioContext.state === 'running') {
      try {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 600;
        oscillator.type = 'sine';

        const baseGain = 0.06 * this.volume;
        gainNode.gain.setValueAtTime(baseGain, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01 * this.volume, this.audioContext.currentTime + 0.05);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.05);
        return;
      } catch (error) {
        // Se falhar, tentar abordagem assíncrona
      }
    }
    
    // Abordagem assíncrona para garantir que o contexto esteja pronto
    this.ensureAudioContextReady().then((audioContext) => {
      if (!audioContext) return;

      try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 600; // Tom médio para clique
        oscillator.type = 'sine';

        const baseGain = 0.06 * this.volume;
        gainNode.gain.setValueAtTime(baseGain, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01 * this.volume, audioContext.currentTime + 0.05);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
      } catch (error) {
        console.warn('Erro ao tocar som de clique:', error);
      }
    }).catch(() => {
      // Silenciosamente falhar se não conseguir inicializar
    });
  }

  /**
   * Toca som de menu abrindo/fechando
   */
  playMenuToggle(): void {
    if (!this.enabled) return;
    
    this.ensureAudioContextReady().then((audioContext) => {
      if (!audioContext) return;

      try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 500; // Tom ligeiramente mais grave para menu
        oscillator.type = 'sine';

        const baseGain = 0.05 * this.volume;
        gainNode.gain.setValueAtTime(baseGain, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01 * this.volume, audioContext.currentTime + 0.06);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.06);
      } catch (error) {
        console.warn('Erro ao tocar som de menu:', error);
      }
    }).catch(() => {
      // Silenciosamente falhar se não conseguir inicializar
    });
  }

  /**
   * Toca som de hover (opcional, mais sutil)
   */
  playHover(): void {
    if (!this.enabled) return;
    
    this.ensureAudioContextReady().then((audioContext) => {
      if (!audioContext) return;

      try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 700; // Tom agudo sutil
        oscillator.type = 'sine';

        const baseGain = 0.03 * this.volume;
        gainNode.gain.setValueAtTime(baseGain, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01 * this.volume, audioContext.currentTime + 0.04);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.04);
      } catch (error) {
        console.warn('Erro ao tocar som de hover:', error);
      }
    }).catch(() => {
      // Silenciosamente falhar se não conseguir inicializar
    });
  }
}
