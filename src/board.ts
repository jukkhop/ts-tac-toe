// Implementation for a single board

enum CellValue {
  Empty = 0,
  X,
  O,
}

interface BoardStruct {
  cells: CellValue[][];
  crossProgress: number;
  isCrossed: boolean;
  isFinished(): boolean;
  play(): void;
  progress: number[][];
  winner: CellValue;
}

class Board implements BoardStruct {
  cells = [
    new Array<CellValue>(),
    new Array<CellValue>(),
    new Array<CellValue>(),
  ];
  crossProgress = 0.0;
  isCrossed = false;
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

  play(): void {
    if (this.isCrossed) {
      // hello
    }
  }

  isFinished(): boolean {
    if (this.isCrossed) {
      return true;
    }

    return false;
  }
}

export { Board, CellValue };
