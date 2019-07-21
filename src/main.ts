/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */

import { Board, CellValue } from './board';
import { scaleCanvas, setupCanvas } from './utils';

const BOARD_AMOUNT = 3.0;
const UPDATE_DELAY = 1000.0;
const ANIM_DURATION = 900.0;

function main(): void {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  // scaleCanvas(canvas, ctx);
  setupCanvas(canvas);

  const width = window.innerWidth;
  const height = window.innerHeight;
  const boardSpacingX = (width / BOARD_AMOUNT) * 0.125;
  const boardSpacingY = (height / BOARD_AMOUNT) * 0.125;
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

    render(ctx, width, height, boardDimensions, boards);
    lastRender = ts;

    if (doUpdate) {
      lastUpdate = ts;
    }

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
): void {
  ctx.font = '20px monospace';
  ctx.fillText('hello', 5, 20);

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

      // Render lines
      for (const i of [1, 2]) {
        const innerOffsetX = i * sqWidth;
        const innerOffsetY = i * sqHeight;

        // Horizontal
        ctx.moveTo(offsetX, offsetY + innerOffsetY);
        ctx.lineTo(offsetX + boardWidth, offsetY + innerOffsetY);

        // Vertical
        ctx.moveTo(offsetX + innerOffsetX, offsetY);
        ctx.lineTo(offsetX + innerOffsetX, offsetY + boardHeight);
      }

      // // Render the noughts and the crosses
      // for cell_x in 0..3 {
      //   for cell_y in 0..3 {
      //     let center_x = cell_x as f64 * sq_width + (sq_width / 2.0) + offset_x;
      //     let center_y = cell_y as f64 * sq_height + (sq_height / 2.0) + offset_y;
      //     let r = sq_height / 5.0;
      //     let cell = board.cells[cell_x][cell_y];
      //     let progress = board.cell_progress[cell_x][cell_y];

      //     match cell {
      //       CellValue:: O => {
      //         ctx.move_to(center_x + r, center_y);
      //         ctx.arc(center_x, center_y, r, 0.0, f64:: consts:: PI * 2.0 * progress)
      //           .unwrap();
      //       }
      //       CellValue:: X => {
      //         let origin_x = center_x - r;
      //         let origin_y = center_y - r;
      //         let target_x = center_x + r;
      //         let target_y = center_y + r;
      //         let inner_progress = if progress < 0.5 { progress * 2.0 } else { 1.0 };
      //         let delta_x = (target_x - origin_x) * inner_progress;
      //         let delta_y = (target_y - origin_y) * inner_progress;

      //         ctx.move_to(origin_x, origin_y);
      //         ctx.line_to(origin_x + delta_x, origin_y + delta_y);

      //         let origin_x = center_x - r;
      //         let origin_y = center_y + r;
      //         let target_x = center_x + r;
      //         let target_y = center_y - r;
      //         let inner_progress = if progress > 0.5 {
      //           (progress - 0.5) * 2.0
      //         } else {
      //           0.0
      //         };
      //         let delta_x = (target_x - origin_x) * inner_progress;
      //         let delta_y = (target_y - origin_y) * inner_progress;

      //         ctx.move_to(origin_x, origin_y);
      //         ctx.line_to(origin_x + delta_x, origin_y + delta_y);
      //       }
      //       CellValue:: Empty => { }
      //     }
      //   }
      // }

      // // Render the cross-overs / strikethroughs
      // if board.is_crossed {
      //   let offset_x = x as f64 * (board_width + board_spacing_x) + board_spacing_x;
      //   let offset_y = y as f64 * (board_height + board_spacing_y) + board_spacing_y;
      //   let result = board.get_win_coordinates();
      //   let progress = board.cross_progress;

      //   match result {
      //     Some(coords) => {
      //       let(x1, y1, x2, y2) = coords;

      //       let origin_x = x1 as f64 * sq_width + (sq_width / 2.0) + offset_x;
      //       let origin_y = y1 as f64 * sq_height + (sq_height / 2.0) + offset_y;
      //       let target_x = x2 as f64 * sq_width + (sq_width / 2.0) + offset_x;
      //       let target_y = y2 as f64 * sq_height + (sq_height / 2.0) + offset_y;
      //       let delta_x = (target_x - origin_x) * progress;
      //       let delta_y = (target_y - origin_y) * progress;

      //       ctx.move_to(origin_x, origin_y);
      //       ctx.line_to(origin_x + delta_x, origin_y + delta_y);
      //     }
      //     None => { }
      //   }
      // }
    }
  }

  ctx.strokeStyle = '#cccccc';
  ctx.stroke();
}

try {
  main();
} catch (err) {
  // eslint-disable-next-line
  console.error(err);
}
