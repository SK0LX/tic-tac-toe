const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let currentPlayer = 'X';
let gameState = [[EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY]];
let gameActive = true;
const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    let grid = parseInt();
    renderGrid(3);
}

function renderGrid (dimension) {
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

function cellClickHandler (row, col) {
    if (!gameActive) return;
    console.log(`Clicked on cell: ${row}, ${col}`);
    if (gameState[row][col] === EMPTY) {
        gameState[row][col] = currentPlayer;
        renderSymbolInCell(currentPlayer, row, col);
        let winCombination = checkWin(currentPlayer);
        if (winCombination !== null) {
            gameActive = false;
            drawWin(winCombination);
        }
        currentPlayer === CROSS ? currentPlayer = ZERO : currentPlayer = CROSS;
    }
    checkDraw();
}

function checkWin(player) {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    const flatGameState = gameState.flat();

    const winningCombo = winConditions.find(condition => {
        return condition.every(index => flatGameState[index] === player);
    });
    return winningCombo || null;
}

function drawWin(combination) {
    combination.forEach(index => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        renderSymbolInCell(gameState[row][col], row, col, '#ff0000');
    });
}

function checkDraw() {
    let hasEmptyCell = false;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (gameState[i][j] === EMPTY) {
                hasEmptyCell = true;
                break;
            }
        }
        if (hasEmptyCell) break;
    }
    
    if (!hasEmptyCell && !checkWin(CROSS) && !checkWin(ZERO)) {
        alert("Победила дружба!");
        gameActive = false;
    }
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell (row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    console.log('reset!');
    gameState = [[EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY]];
    gameActive = true;
    currentPlayer = CROSS;
    renderGrid(3);
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
