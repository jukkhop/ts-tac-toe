import { timestamp } from './utils';

interface FpsCounterStruct {
  frames: number[];
  lastFrame: number;
  tick(): number;
}

class FpsCounter implements FpsCounterStruct {
  frames = new Array<number>();
  lastFrame = timestamp();

  tick(): number {
    const now = timestamp();

    const delta = now - this.lastFrame;
    this.lastFrame = now;
    const fps = (1.0 / delta) * 1000.0;

    // Save only the latest 100 timings.
    this.frames.push(fps);
    const framesLength = this.frames.length;

    if (framesLength > 100) {
      this.frames.shift();
    }

    const sum = this.frames.reduce((acc, curr): number => acc + curr, 0);
    return (sum * 1.0) / framesLength;
  }
}

export { FpsCounter };
