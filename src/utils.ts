/* eslint-disable no-param-reassign */

function scaleCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
): void {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const pixelRatio = window.devicePixelRatio || 1;

  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;

  if (pixelRatio > 1) {
    ctx.scale(pixelRatio, pixelRatio);
  }
}

function setupCanvas(canvas: HTMLCanvasElement): void {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

export { scaleCanvas, setupCanvas };
