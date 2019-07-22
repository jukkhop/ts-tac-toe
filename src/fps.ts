import { timestamp } from './utils';

interface FpsCounterStruct {
  frames: number[];
  lastFrameTimestamp: number;
  tick(): number;
}

class FpsCounter implements FpsCounterStruct {
  frames = new Array<number>();
  lastFrameTimestamp = timestamp();

  tick(): number {
    const now = timestamp();

    const delta = now - this.lastFrameTimestamp;
    this.lastFrameTimestamp = now;
    const fps = (1.0 / delta) * 1000.0;

    // Save only the latest 100 timings.
    this.frames.push(fps);
    const framesLength = this.frames.length;

    if (framesLength > 100) {
      this.frames.shift();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const sum: number = this.frames.reduce((acc, curr) => acc + curr, 0);

    const mean = (1.0 * sum) / framesLength;
    return mean;
  }
}

export { FpsCounter };
