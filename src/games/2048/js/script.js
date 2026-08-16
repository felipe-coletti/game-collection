const gameBoard = document.getElementById('game-board')
const scoreElement = document.getElementById('score')
const resetButton = document.getElementById('reset-button')

let cells = []
let score = 0
let gameActive = true

function initGame() {
    cells = Array(16).fill(0)
    score = 0
    gameActive = true

    updateScore(0)
    renderBoard()
    spawnCell()
    spawnCell()
}

function updateScore(newScore) {
    score = newScore
    scoreElement.textContent = score
}

function renderBoard() {
    gameBoard.innerHTML = ''

    cells.forEach((value, index) => {
        const cellElement = document.createElement('div')

        cellElement.classList.add('cell')

        if (value > 0) {
            cellElement.textContent = value

            cellElement.classList.add(`cell-${value}`)
        }

        gameBoard.appendChild(cellElement)
    })
}

function spawnCell() {
    const emptyIndices = cells
        .map((val, idx) => (val === 0 ? idx : null))
        .filter((val) => val !== null)

    if (emptyIndices.length > 0) {
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)]
        cells[randomIndex] = Math.random() < 0.9 ? 2 : 4

        renderBoard()
    }
}

function slideAndMerge(line) {
    let filtered = line.filter((val) => val !== 0)

    for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
            filtered[i] *= 2
            score += filtered[i]
            filtered[i + 1] = 0
        }
    }
    
    filtered = filtered.filter((val) => val !== 0)

    while (filtered.length < 4) {
        filtered.push(0)
    }
    
    return filtered
}

function moveCells(direction) {
    let hasMoved = false
    const oldCells = [...cells]

    if (direction === 'left' || direction === 'right') {
        for (let row = 0; row < 4; row++) {
            let rowIndex = row * 4
            let rowCells = cells.slice(rowIndex, rowIndex + 4)
            
            if (direction === 'right') rowCells.reverse()
            
            let newRow = slideAndMerge(rowCells)
            
            if (direction === 'right') newRow.reverse()
            
            for (let i = 0; i < 4; i++) {
                cells[rowIndex + i] = newRow[i]
            }
        }
    } 
    else if (direction === 'up' || direction === 'down') {
        for (let col = 0; col < 4; col++) {
            let colCells = []

            for (let row = 0; row < 4; row++) {
                colCells.push(cells[row * 4 + col])
            }
            
            if (direction === 'down') colCells.reverse()
            
            let newCol = slideAndMerge(colCells)
            
            if (direction === 'down') newCol.reverse()
            
            for (let row = 0; row < 4; row++) {
                cells[row * 4 + col] = newCol[row]
            }
        }
    }

    return (JSON.stringify(cells) !== JSON.stringify(oldCells))
}

function checkWin() {
    return cells.some(cell => cell === 2048)
}

function checkGameOver() {
    if (cells.includes(0)) return false;

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 3; col++) {
            if (cells[row * 4 + col] === cells[row * 4 + col + 1]) return false
        }
    }
    for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 3; row++) {
            if (cells[row * 4 + col] === cells[(row + 1) * 4 + col]) return false
        }
    }

    return true
}

function checkGameStatus() {
    if (checkWin()) {
        setTimeout(() => alert('Congratulations! You reached 2048!'), 10)
        gameActive = false
    }
    if (checkGameOver()) {
        setTimeout(() => alert('Game Over! No more moves available.'), 10)
        gameActive = false
    }
}

function handleInput(direction) {
    if (!gameActive) return

    const moved = moveCells(direction)
    
    if (moved) {
        updateScore(score)
        spawnCell()
        checkGameStatus()
    }
}

document.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault()

        const direction = event.key.replace('Arrow', '').toLowerCase()

        handleInput(direction)
    }
})

resetButton.addEventListener('click', initGame)
initGame()