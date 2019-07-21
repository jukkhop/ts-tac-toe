interface BoardSpec {
  cells: number[];
}

class Board implements BoardSpec {
  cells = [];

  constructor() {
    console.log('hello'); // eslint-disable-line no-console
  }
}

export default Board;
