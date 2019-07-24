import { Board, CellValue } from './board';
import { FpsCounter } from './fps';
import { Profiler } from './profiler';
import { scaleCanvas } from './utils';

const BOARD_AMOUNT = 25;
const UPDATE_DELAY = 1000.0;
const ANIM_DURATION = 900.0;

function run(): void {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  scaleCanvas(canvas, ctx);

  const width = window.innerWidth;
  const height = window.innerHeight;
  const boardSpacingX = ((width * 1.0) / BOARD_AMOUNT) * 0.125;
  const boardSpacingY = ((height * 1.0) / BOARD_AMOUNT) * 0.125;
  const totalSpacingX = BOARD_AMOUNT * boardSpacingX + boardSpacingX;
  const totalSpacingY = BOARD_AMOUNT * boardSpacingY + boardSpacingY;
  const boardWidth = Math.floor((width - totalSpacingX) / BOARD_AMOUNT);
  const boardHeight = Math.floor((height - totalSpacingY) / BOARD_AMOUNT);
  const boards: Board[][] = [];

  const boardDimensions: [number, number, number, number] = [
    boardWidth,
    boardHeight,
    boardSpacingX,
    boardSpacingY,
  ];

  const fpsCounter = new FpsCounter();
  const profiler = new Profiler();

  let lastUpdate = 0.0;
  let lastRender = 0.0;

  for (const x of Array(BOARD_AMOUNT).keys()) {
    if (!boards[x]) {
      boards[x] = [];
    }

    for (const y of Array(BOARD_AMOUNT).keys()) {
      boards[x][y] = new Board();
    }
  }

  const update = (ts: number): void => {
    const updateDelta = ts - lastUpdate;
    const renderDelta = ts - lastRender;
    const doUpdate = updateDelta > UPDATE_DELAY;
    const progressIncr = renderDelta / ANIM_DURATION;
    profiler.start();

    for (const x of Array(BOARD_AMOUNT).keys()) {
      for (const y of Array(BOARD_AMOUNT).keys()) {
        let board = boards[x][y];

        if (doUpdate) {
          const wasFinished = board.isFinished();
          const wasCrossed = board.isCrossed;
          const hadWinner = board.winner !== CellValue.Empty;

          if (wasFinished && hadWinner && !wasCrossed) {
            board.isCrossed = true;
          }

          if (wasFinished && hadWinner && wasCrossed) {
            board = new Board();
          }

          if (wasFinished && !hadWinner) {
            board = new Board();
          }

          if (!board.isFinished()) {
            board.play();
          }

          lastUpdate = ts;
        }

        for (const cellX of [0, 1, 2]) {
          for (const cellY of [0, 1, 2]) {
            const cell = board.cells[cellX][cellY];
            let progress = board.progress[cellX][cellY];

            if (cell !== CellValue.Empty && progress < 1.0) {
              progress += progressIncr;
            }

            board.progress[cellX][cellY] = progress < 1.0 ? progress : 1.0;
          }
        }

        if (board.isCrossed) {
          const progress = board.crossProgress + progressIncr;
          board.crossProgress = progress < 1.0 ? progress : 1.0;
        }

        boards[x][y] = board;
      }
    }

    profiler.stop();
    const fps = fpsCounter.tick();
    const updateMean = profiler.mean();

    render(ctx, width, height, boardDimensions, boards, fps, updateMean);
    lastRender = ts;
    requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

function render(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  boardDimensions: [number, number, number, number],
  boards: Board[][],
  fps: number,
  updateMean: number,
): void {
  const [
    boardWidth,
    boardHeight,
    boardSpacingX,
    boardSpacingY,
  ] = boardDimensions;

  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();

  const sqWidth = boardWidth / 3.0;
  const sqHeight = boardHeight / 3.0;

  // Render the boards
  for (const x of Array(BOARD_AMOUNT).keys()) {
    for (const y of Array(BOARD_AMOUNT).keys()) {
      const offsetX = x * (boardWidth + boardSpacingX) + boardSpacingX;
      const offsetY = y * (boardHeight + boardSpacingY) + boardSpacingY;
      const board = boards[x][y];

      // Render the lines
      for (const i of [1, 2]) {
        const innerOffsetX = i * sqWidth;
        const innerOffsetY = i * sqHeight;
        ctx.moveTo(offsetX, offsetY + innerOffsetY);
        ctx.lineTo(offsetX + boardWidth, offsetY + innerOffsetY);
        ctx.moveTo(offsetX + innerOffsetX, offsetY);
        ctx.lineTo(offsetX + innerOffsetX, offsetY + boardHeight);
      }

      // Render the Os and the Xs
      for (const cellX of [0, 1, 2]) {
        for (const cellY of [0, 1, 2]) {
          const centerX = cellX * sqWidth + sqWidth / 2.0 + offsetX;
          const centerY = cellY * sqHeight + sqHeight / 2.0 + offsetY;
          const r = sqHeight / 5.0;
          const cell = board.cells[cellX][cellY];
          const progress = board.progress[cellX][cellY];

          if (cell === CellValue.O) {
            ctx.moveTo(centerX + r, centerY);
            ctx.arc(centerX, centerY, r, 0.0, Math.PI * 2.0 * progress);
          } else if (cell === CellValue.X) {
            let originX = centerX - r;
            let originY = centerY - r;
            let targetX = centerX + r;
            let targetY = centerY + r;
            let innerProgress = progress < 0.5 ? progress * 2.0 : 1.0;
            let deltaX = (targetX - originX) * innerProgress;
            let deltaY = (targetY - originY) * innerProgress;

            ctx.moveTo(originX, originY);
            ctx.lineTo(originX + deltaX, originY + deltaY);

            originX = centerX - r;
            originY = centerY + r;
            targetX = centerX + r;
            targetY = centerY - r;
            innerProgress = progress > 0.5 ? (progress - 0.5) * 2.0 : 0.0;
            deltaX = (targetX - originX) * innerProgress;
            deltaY = (targetY - originY) * innerProgress;

            ctx.moveTo(originX, originY);
            ctx.lineTo(originX + deltaX, originY + deltaY);
          }
        }
      }

      // Render the cross-overs / strikethroughs
      if (board.isCrossed) {
        const winRow = board.getWinRow();
        const progress = board.crossProgress;

        if (winRow) {
          const [x1, y1, x2, y2] = winRow;

          const originX = x1 * sqWidth + sqWidth / 2.0 + offsetX;
          const originY = y1 * sqHeight + sqHeight / 2.0 + offsetY;
          const targetX = x2 * sqWidth + sqWidth / 2.0 + offsetX;
          const targetY = y2 * sqHeight + sqHeight / 2.0 + offsetY;
          const deltaX = (targetX - originX) * progress;
          const deltaY = (targetY - originY) * progress;

          ctx.moveTo(originX, originY);
          ctx.lineTo(originX + deltaX, originY + deltaY);
        }
      }
    }
  }

  ctx.strokeStyle = '#cccccc';
  ctx.stroke();

  // Render metrics
  ctx.font = '20px monospace';
  ctx.fillText(`FPS ${Math.round(fps)}`, 5.0, 20.0);
  ctx.fillText(`Update mean ${updateMean.toFixed(2)}`, 100.0, 20.0);
}

try {
  run();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err);
}
