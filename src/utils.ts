/* eslint-disable no-param-reassign */

export function scaleCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): void {
  const pixelRatio = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;

  if (pixelRatio > 1) {
    ctx.scale(pixelRatio, pixelRatio);
  }
}

export default scaleCanvas;
