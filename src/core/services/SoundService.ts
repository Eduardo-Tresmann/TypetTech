/**
 * Serviço de feedback sonoro
 * Gerencia sons para acertos, erros e interações
 */

export class SoundService {
  private enabled: boolean;
  private volume: number;
  private audioContext: AudioContext | null = null;
  private correctSound: OscillatorNode | null = null;
  private incorrectSound: OscillatorNode | null = null;

  constructor(enabled: boolean = true, volume: number = 0.5) {
    this.enabled = enabled;
    this.volume = volume;
    this.initializeAudioContext();
  }

  private initializeAudioContext(): void {
    if (typeof window !== 'undefined' && window.AudioContext) {
      try {
        this.audioContext = new AudioContext();
      } catch (error) {
        console.warn('AudioContext não disponível:', error);
      }
    }
  }

  /**
   * Toca som de acerto
   */
  playCorrect(): void {
    if (!this.enabled) return;
    
    // Inicializar AudioContext se necessário (alguns navegadores requerem interação do usuário)
    if (!this.audioContext) {
      this.initializeAudioContext();
    }
    
    if (!this.audioContext) return;

    try {
      // Resumir AudioContext se estiver suspenso (requerido por alguns navegadores)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = 800; // Tom agudo para acerto
      oscillator.type = 'sine';

      const baseGain = 0.08 * this.volume;
      gainNode.gain.setValueAtTime(baseGain, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * this.volume, this.audioContext.currentTime + 0.08);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.08);
    } catch (error) {
      console.warn('Erro ao tocar som de acerto:', error);
    }
  }

  /**
   * Toca som de erro
   */
  playIncorrect(): void {
    if (!this.enabled) return;
    
    // Inicializar AudioContext se necessário (alguns navegadores requerem interação do usuário)
    if (!this.audioContext) {
      this.initializeAudioContext();
    }
    
    if (!this.audioContext) return;

    try {
      // Resumir AudioContext se estiver suspenso (requerido por alguns navegadores)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = 200; // Tom grave para erro
      oscillator.type = 'sawtooth';

      const baseGain = 0.12 * this.volume;
      gainNode.gain.setValueAtTime(baseGain, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * this.volume, this.audioContext.currentTime + 0.12);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.12);
    } catch (error) {
      console.warn('Erro ao tocar som de erro:', error);
    }
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
   * Toca som de clique/interação (botões, links, menus)
   */
  playClick(): void {
    if (!this.enabled) return;
    
    if (!this.audioContext) {
      this.initializeAudioContext();
    }
    
    if (!this.audioContext) return;

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = 600; // Tom médio para clique
      oscillator.type = 'sine';

      const baseGain = 0.06 * this.volume;
      gainNode.gain.setValueAtTime(baseGain, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * this.volume, this.audioContext.currentTime + 0.05);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.05);
    } catch (error) {
      console.warn('Erro ao tocar som de clique:', error);
    }
  }

  /**
   * Toca som de menu abrindo/fechando
   */
  playMenuToggle(): void {
    if (!this.enabled) return;
    
    if (!this.audioContext) {
      this.initializeAudioContext();
    }
    
    if (!this.audioContext) return;

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = 500; // Tom ligeiramente mais grave para menu
      oscillator.type = 'sine';

      const baseGain = 0.05 * this.volume;
      gainNode.gain.setValueAtTime(baseGain, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * this.volume, this.audioContext.currentTime + 0.06);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.06);
    } catch (error) {
      console.warn('Erro ao tocar som de menu:', error);
    }
  }

  /**
   * Toca som de hover (opcional, mais sutil)
   */
  playHover(): void {
    if (!this.enabled) return;
    
    if (!this.audioContext) {
      this.initializeAudioContext();
    }
    
    if (!this.audioContext) return;

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = 700; // Tom agudo sutil
      oscillator.type = 'sine';

      const baseGain = 0.03 * this.volume;
      gainNode.gain.setValueAtTime(baseGain, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * this.volume, this.audioContext.currentTime + 0.04);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.04);
    } catch (error) {
      console.warn('Erro ao tocar som de hover:', error);
    }
  }
}
