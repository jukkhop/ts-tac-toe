(() => {
    const defines = {};
    const entry = [null];
    function define(name, dependencies, factory) {
        defines[name] = { dependencies, factory };
        entry[0] = name;
    }
    define("require", ["exports"], (exports) => {
        Object.defineProperty(exports, "__cjsModule", { value: true });
        Object.defineProperty(exports, "default", { value: (name) => resolve(name) });
    });
    define("math", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        // Returns a random integer between min (include) and max (include)
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        exports.getRandomInt = getRandomInt;
    });
    // Implementation for a single board
    define("board", ["require", "exports", "math"], function (require, exports, math_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        var CellValue;
        (function (CellValue) {
            CellValue[CellValue["Empty"] = 0] = "Empty";
            CellValue[CellValue["O"] = 1] = "O";
            CellValue[CellValue["X"] = 2] = "X";
        })(CellValue || (CellValue = {}));
        exports.CellValue = CellValue;
        class CellUtils {
            static next(value) {
                if (value === CellValue.O) {
                    return CellValue.X;
                }
                if (value === CellValue.X) {
                    return CellValue.O;
                }
                return CellValue.Empty;
            }
        }
        class Board {
            constructor() {
                this.cells = [
                    new Array(),
                    new Array(),
                    new Array(),
                ];
                this.crossProgress = 0.0;
                this.currentPlayer = CellValue.O;
                this.isCrossed = false;
                this.moveCount = 0;
                this.progress = [new Array(), new Array(), new Array()];
                this.winner = CellValue.Empty;
                for (const x of [0, 1, 2]) {
                    for (const y of [0, 1, 2]) {
                        this.cells[x][y] = CellValue.Empty;
                        this.progress[x][y] = 0.0;
                    }
                }
            }
            findMove() {
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
                return freeCells[math_1.getRandomInt(0, freeCells.length - 1)];
            }
            getFreeCells() {
                const freeCells = new Array();
                for (const x of [0, 1, 2]) {
                    for (const y of [0, 1, 2]) {
                        if (this.cells[x][y] === CellValue.Empty) {
                            freeCells.push([x, y]);
                        }
                    }
                }
                return freeCells;
            }
            getWinRow() {
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
            isFinished() {
                return this.currentPlayer === CellValue.Empty;
            }
            isWinning(x, y, p) {
                const c = this.cells;
                if (x === 0 && y === 0) {
                    return ((c[0][1] === p && c[1][0] === p) ||
                        (c[1][0] === p && c[2][0] === p) ||
                        (c[1][1] === p && c[2][2] === p));
                }
                if (x === 0 && y === 1) {
                    return ((c[0][0] === p && c[0][2] === p) || (c[1][1] === p && c[2][1] === p));
                }
                if (x === 0 && y === 2) {
                    return ((c[0][0] === p && c[0][1] === p) ||
                        (c[1][2] === p && c[2][2] === p) ||
                        (c[2][0] === p && c[1][1] === p));
                }
                if (x === 1 && y === 1) {
                    return ((c[0][0] === p && c[2][2] === p) ||
                        (c[0][2] === p && c[2][0] === p) ||
                        (c[0][1] === p && c[2][1] === p) ||
                        (c[1][0] === p && c[1][2] === p));
                }
                if (x === 1 && y === 2) {
                    return ((c[1][0] === p && c[1][1] === p) || (c[0][2] === p && c[2][2] === p));
                }
                if (x === 2 && y === 0) {
                    return ((c[2][1] === p && c[2][2] === p) ||
                        (c[0][0] === p && c[1][0] === p) ||
                        (c[1][1] === p && c[0][2] === p));
                }
                if (x === 2 && y === 1) {
                    return ((c[2][0] === p && c[2][2] === p) || (c[0][1] === p && c[1][1] === p));
                }
                if (x === 2 && y === 2) {
                    return ((c[2][0] === p && c[2][1] === p) ||
                        (c[0][2] === p && c[1][2] === p) ||
                        (c[0][0] === p && c[1][1] === p));
                }
                return false;
            }
            play() {
                const [x, y] = this.findMove();
                const p = this.currentPlayer;
                this.moveCount += 1;
                this.cells[x][y] = p;
                if (this.isWinning(x, y, p)) {
                    this.winner = p;
                    this.currentPlayer = CellValue.Empty;
                }
                else {
                    this.currentPlayer =
                        this.moveCount === 9
                            ? CellValue.Empty
                            : CellUtils.next(this.currentPlayer);
                }
            }
        }
        exports.Board = Board;
    });
    /* eslint-disable no-param-reassign */
    define("utils", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        function scaleCanvas(canvas, ctx) {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const pixelRatio = window.devicePixelRatio || 1;
            canvas.width = width * pixelRatio;
            canvas.height = height * pixelRatio;
            if (pixelRatio > 1) {
                ctx.scale(pixelRatio, pixelRatio);
            }
        }
        exports.scaleCanvas = scaleCanvas;
        function setupCanvas(canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        exports.setupCanvas = setupCanvas;
        function timestamp() {
            return window.performance.now();
        }
        exports.timestamp = timestamp;
    });
    define("fps", ["require", "exports", "utils"], function (require, exports, utils_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        class FpsCounter {
            constructor() {
                this.frames = new Array();
                this.lastFrameTimestamp = utils_1.timestamp();
                this.frames = new Array();
                this.lastFrameTimestamp = utils_1.timestamp();
            }
            tick() {
                const now = utils_1.timestamp();
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
                const sum = this.frames.reduce((acc, curr) => acc + curr, 0);
                const mean = (1.0 * sum) / framesLength;
                return mean;
            }
        }
        exports.FpsCounter = FpsCounter;
    });
    define("main", ["require", "exports", "board", "fps", "utils"], function (require, exports, board_1, fps_1, utils_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const BOARD_AMOUNT = 25;
        const UPDATE_DELAY = 1000.0;
        const ANIM_DURATION = 900.0;
        function main() {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            utils_2.scaleCanvas(canvas, ctx);
            const width = window.innerWidth;
            const height = window.innerHeight;
            const boardSpacingX = ((width * 1.0) / BOARD_AMOUNT) * 0.125;
            const boardSpacingY = ((height * 1.0) / BOARD_AMOUNT) * 0.125;
            const totalSpacingX = BOARD_AMOUNT * boardSpacingX + boardSpacingX;
            const totalSpacingY = BOARD_AMOUNT * boardSpacingY + boardSpacingY;
            const boardWidth = Math.floor((width - totalSpacingX) / BOARD_AMOUNT);
            const boardHeight = Math.floor((height - totalSpacingY) / BOARD_AMOUNT);
            const boards = [];
            const boardDimensions = [
                boardWidth,
                boardHeight,
                boardSpacingX,
                boardSpacingY,
            ];
            let lastUpdate = 0.0;
            let lastRender = 0.0;
            const fpsCounter = new fps_1.FpsCounter();
            for (const x of Array(BOARD_AMOUNT).keys()) {
                if (!boards[x]) {
                    boards[x] = [];
                }
                for (const y of Array(BOARD_AMOUNT).keys()) {
                    boards[x][y] = new board_1.Board();
                }
            }
            const update = (ts) => {
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
                            const hadWinner = board.winner !== board_1.CellValue.Empty;
                            if (wasFinished && hadWinner && !wasCrossed) {
                                board.isCrossed = true;
                            }
                            if (wasFinished && hadWinner && wasCrossed) {
                                board = new board_1.Board();
                            }
                            if (wasFinished && !hadWinner) {
                                board = new board_1.Board();
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
                                if (cell !== board_1.CellValue.Empty && progress < 1.0) {
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
                const fps = fpsCounter.tick();
                render(ctx, width, height, boardDimensions, boards, fps);
                lastRender = ts;
                requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
        }
        function render(ctx, width, height, boardDimensions, boards, fps) {
            ctx.font = '20px monospace';
            ctx.fillText('hello', 5, 20);
            const [boardWidth, boardHeight, boardSpacingX, boardSpacingY,] = boardDimensions;
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
                            if (cell === board_1.CellValue.O) {
                                ctx.moveTo(centerX + r, centerY);
                                ctx.arc(centerX, centerY, r, 0.0, Math.PI * 2.0 * progress);
                            }
                            else if (cell === board_1.CellValue.X) {
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
            // Render the fps counter
            ctx.font = '20px monospace';
            ctx.fillText(`FPS ${Math.round(fps)}`, 5.0, 20.0);
        }
        try {
            main();
        }
        catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
        }
    });
    
    'marker:resolver';

    function get_define(name) {
        if (defines[name]) {
            return defines[name];
        }
        else if (defines[name + '/index']) {
            return defines[name + '/index'];
        }
        else {
            const dependencies = ['exports'];
            const factory = (exports) => {
                try {
                    Object.defineProperty(exports, "__cjsModule", { value: true });
                    Object.defineProperty(exports, "default", { value: require(name) });
                }
                catch (_a) {
                    throw Error(['module "', name, '" not found.'].join(''));
                }
            };
            return { dependencies, factory };
        }
    }
    const instances = {};
    function resolve(name) {
        if (instances[name]) {
            return instances[name];
        }
        if (name === 'exports') {
            return {};
        }
        const define = get_define(name);
        instances[name] = {};
        const dependencies = define.dependencies.map(name => resolve(name));
        define.factory(...dependencies);
        const exports = dependencies[define.dependencies.indexOf('exports')];
        instances[name] = (exports['__cjsModule']) ? exports.default : exports;
        return instances[name];
    }
    if (entry[0] !== null) {
        return resolve(entry[0]);
    }
})();