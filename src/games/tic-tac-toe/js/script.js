const gameBoard = document.getElementById('game-board')
const instructions = document.getElementById('instructions')
const resetButton = document.getElementById('reset-button')

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
]
const cells = ['', '', '', '', '', '', '', '', '']

let currentPlayer = 'X'
let gameActive = true

function updateInstructions() {
    instructions.textContent = `Player ${currentPlayer}'s turn`
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'
    updateInstructions()
}

function updateCell(index) {
    const cellElement = gameBoard.querySelector(`.cell[data-index='${index}']`)

    if (cellElement.querySelector('div')) {
        return
    }

    cells[index] = currentPlayer

    const symbol = document.createElement('div')
    
    if (currentPlayer === 'X') {
        symbol.classList.add('cross')
    } else {
        symbol.classList.add('circle')
    }

    cellElement.appendChild(symbol)
}

function createBoard() {
    cells.forEach((_cell, index) => {
        const cellElement = document.createElement('div')
        cellElement.classList.add('cell')
        cellElement.dataset.index = index
        cellElement.addEventListener('click', () => handleCellClick(index))
        gameBoard.appendChild(cellElement)
    })
}

function checkWin() {
    return winConditions.some(combination => {
        return combination.every(index => {
            return cells[index] === currentPlayer
        })
    })
}

function checkDraw() {
    return !cells.includes('')
}

function handleCellClick(index) {
    if (!gameActive || cells[index] !== '') {
        return
    }

    updateCell(index)

    if (checkWin()) {
        instructions.textContent = `Player ${currentPlayer} Wins!`
        gameActive = false
        return
    }

    if (checkDraw()) {
        instructions.textContent = "It's a Draw!"
        gameActive = false
        return
    }

    switchPlayer()
}

function resetGame() {
    cells.fill('')

    currentPlayer = 'X'
    instructions.textContent = 'X goes first'
    gameActive = true

    const cellElements = document.querySelectorAll('.cell')
    cellElements.forEach(cell => {
        cell.innerHTML = ''
    })
}

resetButton.addEventListener('click', resetGame)

createBoard()