import { timestamp } from './utils';

interface ProfilerStruct {
  deltas: number[];
  startTime: number;
  start(): void;
  stop(): void;
  mean(): number;
}

class Profiler implements ProfilerStruct {
  deltas = new Array<number>();
  startTime = timestamp();

  start(): void {
    this.startTime = timestamp();
  }

  stop(): void {
    const now = timestamp();
    const delta = now - this.startTime;

    this.deltas.push(delta);

    if (this.deltas.length > 100) {
      this.deltas.shift();
    }
  }

  mean(): number {
    const sum = this.deltas.reduce((acc, curr): number => acc + curr, 0);
    return (sum * 1.0) / this.deltas.length;
  }
}

export { Profiler };
