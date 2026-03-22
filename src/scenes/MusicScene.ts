import Phaser from 'phaser';
import { VIEWPORT_WIDTH } from '../config';

const VOLUME = 0.24;

export class MusicScene extends Phaser.Scene {
  private btn!: Phaser.GameObjects.Text;
  private muted = false;
  private currentTrack: string | null = null;
  private ready = false;
  private pendingTrack: string | null = null;

  constructor() {
    super({ key: 'MusicScene' });
  }

  create(): void {
    this.btn = this.add.text(VIEWPORT_WIDTH - 10, 10, '♫', {
      fontSize: '18px',
      color: '#ffd700',
      backgroundColor: '#000000aa',
      padding: { x: 6, y: 3 },
    })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(1000)
      .setInteractive({ useHandCursor: true });

    this.btn.on('pointerdown', () => this.toggleMute());

    this.input.keyboard!.on('keydown-M', () => this.toggleMute());

    this.ready = true;

    // Play any track that was requested before create() ran
    if (this.pendingTrack) {
      const key = this.pendingTrack;
      this.pendingTrack = null;
      this.switchTrack(key);
    }
  }

  /** Switch to a different music track (stops current if different). */
  switchTrack(key: string): void {
    // If scene isn't ready yet, queue the track for when create() fires
    if (!this.ready) {
      this.pendingTrack = key;
      return;
    }

    if (this.currentTrack === key) return;

    // Stop current track
    if (this.currentTrack) {
      const current = this.sound.get(this.currentTrack);
      if (current) current.stop();
    }

    this.currentTrack = key;

    const play = () => {
      if (!this.sound.get(key)?.isPlaying) {
        this.sound.play(key, { loop: true, volume: VOLUME });
      }
    };

    if (this.sound.locked) {
      this.sound.once('unlocked', play);
    } else {
      play();
    }
  }

  private toggleMute(): void {
    this.muted = !this.muted;
    this.sound.mute = this.muted;
    this.btn.setText(this.muted ? '♫✕' : '♫');
    this.btn.setColor(this.muted ? '#666666' : '#ffd700');
  }
}
