import Board from './board';
import { scaleCanvas } from './utils';

function main(): void {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  scaleCanvas(canvas, ctx);

  ctx.font = '20px monospace';
  ctx.fillText('hello', 5, 20);

  const board = new Board();
  console.log('board', board); // eslint-disable-line
}

try {
  main();
} catch (err) {
  // eslint-disable-next-line
  console.error(err);
}
