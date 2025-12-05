import { AlgorithmStep, EngineCallbacks, VisualState } from './types';

const BASE_DELAY_MS = 650;

export class VisualizerEngine {
  private steps: AlgorithmStep[] = [];
  private history: VisualState[] = [];
  private index = -1; // -1 means before first step
  private timer: number | null = null;
  private speed = 1;
  private callbacks: EngineCallbacks = {};
  private loop = false;
  private globalVars: Record<string, unknown> = {};

  load(steps: AlgorithmStep[], initialState: VisualState, callbacks?: EngineCallbacks) {
    this.steps = steps;
    this.history = [initialState, ...steps.map((s) => s.state)];
    this.index = -1;
    this.callbacks = callbacks || this.callbacks;
    this.globalVars = {};
    this.emit();
  }

  play() {
    if (this.timer) return;
    this.callbacks.onPlay?.();
    const tick = () => {
      const advanced = this.stepForward();
      if (!advanced) {
        if (this.loop) {
          this.index = -1;
          this.emit();
        } else {
          this.pause();
        }
      }
    };
    this.timer = window.setInterval(tick, BASE_DELAY_MS / this.speed);
  }

  pause() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
      this.callbacks.onPause?.();
    }
  }

  reset() {
    this.pause();
    this.index = -1;
    this.emit();
    this.callbacks.onReset?.();
  }

  setSpeed(multiplier: number) {
    this.speed = Math.max(0.1, Math.min(3, multiplier));
    if (this.timer) {
      this.pause();
      this.play();
    }
  }

  setLoop(enabled: boolean) {
    this.loop = enabled;
  }

  stepForward(): boolean {
    if (this.index >= this.steps.length - 1) return false;
    this.index += 1;
    this.emit();
    return true;
  }

  stepBackward(): boolean {
    if (this.index <= -1) return false;
    this.index -= 1;
    this.emit();
    return true;
  }

  isPlaying() {
    return Boolean(this.timer);
  }

  getPosition() {
    return { index: this.index, total: this.steps.length };
  }

  private emit() {
    const step = this.index >= 0 ? this.steps[this.index] : null;
    if (step) {
      Object.entries(step.vars).forEach(([k, v]) => {
        this.globalVars[k] = v;
      });
      step.vars = { ...this.globalVars };
    }
    const state = this.history[this.index + 1] || this.history[0] || {};
    this.callbacks.onStep?.({ step, index: this.index, state });
  }
}

export default VisualizerEngine;
