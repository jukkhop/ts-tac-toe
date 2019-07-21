// Implementation for a single board

import { getRandomInt } from './math';

enum CellValue {
  Empty = 0,
  O,
  X,
}

class CellUtils {
  static next(value: CellValue): CellValue {
    if (value === CellValue.O) {
      return CellValue.X;
    }

    if (value === CellValue.X) {
      return CellValue.O;
    }

    return CellValue.Empty;
  }
}

interface BoardStruct {
  cells: CellValue[][];
  crossProgress: number;
  currentPlayer: CellValue;
  isCrossed: boolean;
  moveCount: number;
  progress: number[][];
  winner: CellValue;
  findMove(): [number, number];
  getFreeCells(): [number, number][];
  getWinRow(): [number, number, number, number];
  isFinished(): boolean;
  isWinning(x: number, y: number, p: CellValue): boolean;
  play(): void;
}

class Board implements BoardStruct {
  cells = [
    new Array<CellValue>(),
    new Array<CellValue>(),
    new Array<CellValue>(),
  ];
  crossProgress = 0.0;
  currentPlayer = CellValue.O;
  isCrossed = false;
  moveCount = 0;
  progress = [new Array<number>(), new Array<number>(), new Array<number>()];
  winner = CellValue.Empty;

  constructor() {
    for (const x of [0, 1, 2]) {
      for (const y of [0, 1, 2]) {
        this.cells[x][y] = CellValue.Empty;
        this.progress[x][y] = 0.0;
      }
    }
  }

  findMove(): [number, number] {
    const freeCells = this.getFreeCells();

    // Check if there's a winning move
    for (const c of freeCells) {
      if (this.isWinning(c[0], c[1], this.currentPlayer)) {
        return c;
      }
    }

    // Check if we can prevent the opponent from winning
    const opponent = CellUtils.next(this.currentPlayer);

    for (const c of freeCells) {
      if (this.isWinning(c[0], c[1], opponent)) {
        return c;
      }
    }

    // Otherwise, make a random move
    return freeCells[getRandomInt(0, freeCells.length - 1)];
  }

  getFreeCells(): [number, number][] {
    const freeCells = new Array<[number, number]>();

    for (const x of [0, 1, 2]) {
      for (const y of [0, 1, 2]) {
        if (this.cells[x][y] === CellValue.Empty) {
          freeCells.push([x, y]);
        }
      }
    }

    return freeCells;
  }

  getWinRow(): [number, number, number, number] {
    const w = this.winner;
    const c = this.cells;

    if (c[0][0] === w && c[0][1] === w && c[0][2] === w) {
      return [0, 0, 0, 2];
    }

    if (c[1][0] === w && c[1][1] === w && c[1][2] === w) {
      return [1, 0, 1, 2];
    }

    if (c[2][0] === w && c[2][1] === w && c[2][2] === w) {
      return [2, 0, 2, 2];
    }

    if (c[0][0] === w && c[1][0] === w && c[2][0] === w) {
      return [0, 0, 2, 0];
    }

    if (c[0][1] === w && c[1][1] === w && c[2][1] === w) {
      return [0, 1, 2, 1];
    }

    if (c[0][2] === w && c[1][2] === w && c[2][2] === w) {
      return [0, 2, 2, 2];
    }

    if (c[0][0] === w && c[1][1] === w && c[2][2] === w) {
      return [0, 0, 2, 2];
    }

    if (c[0][2] === w && c[1][1] === w && c[2][0] === w) {
      return [0, 2, 2, 0];
    }

    return [0, 0, 0, 0];
  }

  isFinished(): boolean {
    return this.currentPlayer === CellValue.Empty;
  }

  isWinning(x: number, y: number, p: CellValue): boolean {
    const c = this.cells;

    if (x === 0 && y === 0) {
      return (
        (c[0][1] === p && c[1][0] === p) ||
        (c[1][0] === p && c[2][0] === p) ||
        (c[1][1] === p && c[2][2] === p)
      );
    }

    if (x === 0 && y === 1) {
      return (
        (c[0][0] === p && c[0][2] === p) || (c[1][1] === p && c[2][1] === p)
      );
    }

    if (x === 0 && y === 2) {
      return (
        (c[0][0] === p && c[0][1] === p) ||
        (c[1][2] === p && c[2][2] === p) ||
        (c[2][0] === p && c[1][1] === p)
      );
    }

    if (x === 1 && y === 1) {
      return (
        (c[0][0] === p && c[2][2] === p) ||
        (c[0][2] === p && c[2][0] === p) ||
        (c[0][1] === p && c[2][1] === p) ||
        (c[1][0] === p && c[1][2] === p)
      );
    }

    if (x === 1 && y === 2) {
      return (
        (c[1][0] === p && c[1][1] === p) || (c[0][2] === p && c[2][2] === p)
      );
    }

    if (x === 2 && y === 0) {
      return (
        (c[2][1] === p && c[2][2] === p) ||
        (c[0][0] === p && c[1][0] === p) ||
        (c[1][1] === p && c[0][2] === p)
      );
    }

    if (x === 2 && y === 1) {
      return (
        (c[2][0] === p && c[2][2] === p) || (c[0][1] === p && c[1][1] === p)
      );
    }

    if (x === 2 && y === 2) {
      return (
        (c[2][0] === p && c[2][1] === p) ||
        (c[0][2] === p && c[1][2] === p) ||
        (c[0][0] === p && c[1][1] === p)
      );
    }

    return false;
  }

  play(): void {
    const [x, y] = this.findMove();
    const p = this.currentPlayer;

    this.moveCount += 1;
    this.cells[x][y] = p;

    if (this.isWinning(x, y, p)) {
      this.winner = p;
      this.currentPlayer = CellValue.Empty;
    } else {
      this.currentPlayer =
        this.moveCount === 9
          ? CellValue.Empty
          : CellUtils.next(this.currentPlayer);
    }
  }
}

export { Board, CellValue };
