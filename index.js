const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let currentPlayer = CROSS;
let gameState = [];
let gameActive = true;
let gridSize = 3;
const container = document.getElementById('fieldWrapper');
const winLength = 3;

startGame();
addResetListener();

function startGame() {
    gridSize = parseInt(prompt("Введите размер поля:", "3")) || 3;
    gameState = Array.from({ length: gridSize }, () => Array(gridSize).fill(EMPTY));
    renderGrid(gridSize);
}

function renderGrid(dimension) {
    container.innerHTML = '';
    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler(row, col) {
    if (!gameActive || gameState[row][col] !== EMPTY) return;
    gameState[row][col] = currentPlayer;
    renderSymbolInCell(currentPlayer, row, col);
    const winCombination = checkWin(currentPlayer, row, col);
    if (winCombination != null) {
        gameActive = false;
        drawWin(winCombination);
        alert(currentPlayer);
    } else if (checkDraw()) {
        alert("Победила дружба!");
        gameActive = false;
    } else {
        expandGrid()
        currentPlayer = currentPlayer === CROSS ? ZERO : CROSS;
    }
}

function checkWin(player, row, col) {
    const directions = [
        [0, 1], [1, 0], [1, 1], [1, -1]
    ];

    for (let [dx, dy] of directions) {
        let combination = [[row, col]];
        combination.push(...getSimilarCells(player, row, col, dx, dy));
        combination.push(...getSimilarCells(player, row, col, -dx, -dy));
        if (combination.length >= winLength) return combination;
    }
    return null;
}

function getSimilarCells(player, row, col, dx, dy) {
    let cells = [];
    let x = row + dx, y = col + dy;
    while (x >= 0 && y >= 0 && x < gridSize && y < gridSize && gameState[x][y] === player) {
        cells.push([x, y]);
        x += dx;
        y += dy;
    }
    return cells;
}

function checkDraw() {
    return gameState.flat().every(cell => cell !== EMPTY);
}

function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);
    
    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function drawWin(combination) {
    combination.forEach(([row, col]) => {
        renderSymbolInCell(gameState[row][col], row, col, '#ff0000');
    });
}

function findCell (row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener() {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler() {
    gameActive = true;
    currentPlayer = CROSS;
    startGame();
}

function drawOldMotion() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (gameState[i][j] !== EMPTY) {
                renderSymbolInCell(gameState[i][j], i, j);
            }
        }
    }
}

function expandGrid() {
    if (gameState.flat().filter(cell => cell !== EMPTY).length <= (gridSize * gridSize) / 2) {
        return;
    }

    gridSize += 2;
    let newGameState = Array.from({ length: gridSize }, () => Array(gridSize).fill(EMPTY));
    
    for (let i = 0; i < gameState.length; i++) {
        for (let j = 0; j < gameState[i].length; j++) {
            newGameState[i + 1][j + 1] = gameState[i][j];
        }
    }

    gameState = newGameState;
    renderGrid(gridSize);

    drawOldMotion();
}



/* Test Function */
/* Победа первого игрока */
function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw () {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}