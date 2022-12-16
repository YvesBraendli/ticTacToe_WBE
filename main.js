import { render } from './modules/suiweb.js'; 

const BOARD_ROW = 6
const BOARD_COL = 7
const PLAYER_RED = "Rot"
const PLAYER_BLUE = "Blau"

const url = 'http://localhost:3000/'
const datakey = 'connect4key'

let state = {
    board: Array(BOARD_ROW).fill('').map(el => Array(BOARD_COL).fill('')),
    activePlayer: PLAYER_BLUE,
    gameOver: false
}

let stateSeq = []

let players = [PLAYER_BLUE, PLAYER_RED]

function undo() {
    if (stateSeq.length > 0) {
        state = stateSeq.pop()
        updateBoard()
        updatePlayerTitle() // just to set the subtitle of current player
    }
}

const setInList = (lst, idx, val) => {
    return [...lst.slice(0, idx), val, ...lst.slice(idx + 1)]
}

const setInObj = (obj, attr, val) => {
    let newObj = {}
    newObj[attr] = val
    return {
        ...obj,
        ...newObj
    }
}
//TODO - Die Komponentenlogik von SUIWEB

const App = () => [Board, { board: state.board }]

const Board = ({ board }) => {
    let fields = []
    for(var r = 0; r < board.length; r++) {
        for(var c = 0; c < board[r].length; c++) {
            var type = state.board[r][c]
            fields.push([Field, { type, r, c }])
        }
    }
    return (
        ["div", { className: "board"}, ...fields]
    )
}

const Field = ({ type, r, c }) => {

    const hasPiece = !!type
    if (hasPiece) {
        var piece = ["div", {
            className: `piece ${type}`
        }]
        return ["div", { className: `field`, id: `${r}${c}`}, piece]
    } 
    return ["div", { className: `field`, id: `${r}${c}`}]
}

function color(type){
    switch (type) {
        case 'r':
            return 'Rot'
        case 'b':
            return 'Blau'
    }
}

export function launch(){

    document.getElementById('newGame').onclick = newGame
    document.getElementById('loadServer').onclick = loadGame
    document.getElementById('saveServer').onclick = saveState
    document.getElementById('loadLocal').onclick = loadStateCache
    document.getElementById('saveLocal').onclick = saveStateCache
    document.getElementById('undo').onclick = undo

    showBoard()
    updatePlayerTitle()
}

export function showBoard(){
    let app = document.getElementById("app")
    render([App], app)
    var field
    for (let r = 0; r < BOARD_ROW; r++) {
        for (let c = 0; c < BOARD_COL; c++) {
            field = document.getElementById(`${r}${c}`)
            field.addEventListener("click", () => clickOnField(r, c))
        }
    }
}

function newGame() {
    
    state = {
        board: Array(BOARD_ROW).fill('').map(el => Array(BOARD_COL).fill('')),
        activePlayer: PLAYER_BLUE,
        gameOver: false
    }
    
    let myNode = document.getElementById("app");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }
    showBoard();
    updatePlayerTitle();
}

// display board state in UI
function updateBoard() {

    let myNode = document.getElementById("app");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }

    showBoard();
    updatePlayerTitle();
}



function clickOnField(row, col) {



    //TODO variable soll gesetzt werden, wenn ein sieger ermittelt wurde
    if (state.gameOver) {
        return;
    }
    stateSeq.push(state)

    // CHECK if current col is already full
    if (state.board[0][col] !== '') {
        alert("Ups, hier passt kein Stein mehr rein!");
        return;
    }

    // EDIT caller row to next free row, so we can stack the coins
    for (row = BOARD_ROW - 1; row >= 0; row--) {
        if (state.board[row][col] == '') {
            break
        }
    }

    // EDIT the board state with the players color
    //state.board[row][col] = state.activePlayer


    // Code for setting new state without affecting old state
    state = setInObj(state, "board", setInList(state.board, row, setInList(state.board[row], col % 7, state.activePlayer)))

    // CREATE new chip element and add it to the HTML
    let newPiece = getPiece(state.activePlayer)
    document.getElementById(`${row}${col}`).append(newPiece)
    switchPlayer()
    checkWinner()
}

function getPiece(color) {
    var node = document.createElement("div")
    node.setAttribute("class", `piece ${color}`)
    return node
}

function switchPlayer() {
    state.activePlayer = players[(players.indexOf(state.activePlayer) + 1) % players.length]
    updatePlayerTitle()
}

function updatePlayerTitle() {
    document.getElementById("subTitle").innerHTML = `Spieler ${state.activePlayer} ist am Zug`
    document.getElementById("subTitle").setAttribute("class", state.activePlayer)
}


function checkWinner() {
    // horizontal
    for (let r = 0; r < BOARD_ROW; r++) {
        for (let c = 0; c < BOARD_COL - 3; c++) {
            if (state.board[r][c] != '') {
                if (state.board[r][c] == state.board[r][c + 1] && state.board[r][c + 1] == state.board[r][c + 2] && state.board[r][c + 2] == state.board[r][c + 3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // vertical
    for (let c = 0; c < BOARD_COL; c++) {
        for (let r = 0; r < BOARD_ROW - 3; r++) {
            if (state.board[r][c] != '') {
                if (state.board[r][c] == state.board[r + 1][c] && state.board[r + 1][c] == state.board[r + 2][c] && state.board[r + 2][c] == state.board[r + 3][c]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // anti diagonal
    for (let r = 0; r < BOARD_ROW - 3; r++) {
        for (let c = 0; c < BOARD_COL - 3; c++) {
            if (state.board[r][c] != '') {
                if (state.board[r][c] == state.board[r + 1][c + 1] && state.board[r + 1][c + 1] == state.board[r + 2][c + 2] && state.board[r + 2][c + 2] == state.board[r + 3][c + 3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // diagonal
    for (let r = 3; r < BOARD_ROW; r++) {
        for (let c = 0; c < BOARD_COL - 3; c++) {
            if (state.board[r][c] != '') {
                if (state.board[r][c] == state.board[r - 1][c + 1] && state.board[r - 1][c + 1] == state.board[r - 2][c + 2] && state.board[r - 2][c + 2] == state.board[r - 3][c + 3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
}

function setWinner(r, c) {
    let winner = state.board[r][c];
    if (winner == PLAYER_RED) {
        document.getElementById("subTitle").innerText = "Spieler Rot hat gewonnen!!!";
        document.getElementById("subTitle").setAttribute("class", PLAYER_RED);
    } else {
        document.getElementById("subTitle").innerText = "Spieler Blau hat gewonnen!!!";
        document.getElementById("subTitle").setAttribute("class", PLAYER_BLUE);
    }
    state.gameOver = true;
}



function renderSJDON(sjdon, node) {
    if (Array.isArray(sjdon)) {
        let [type, ...children] = sjdon
        let newNode = document.createElement(type)
        for (let child of children) renderSJDON(child, newNode)
        node.appendChild(newNode)
    } else if (typeof sjdon === 'object') {
        for (attr in sjdon) {
            node.setAttribute(attr, sjdon[attr])
        }
    } else {
        node.appendChild(document.createTextNode(sjdon))
    }
}


//  Helper function for DOM manipulation
function elt(type, attrs, ...children) {
    let node = document.createElement(type)
    for (a in attrs) {
        node.setAttribute(a, attrs[a])
    }
    for (let child of children) {
        if (typeof child != "string") node.appendChild(child)
        else node.appendChild(document.createTextNode(child))
    }
    return node
}

//  Put current state to server
//
function saveState() {
    fetch(url + 'api/data/' + datakey + '?api-key=c4game', {
        method: 'PUT',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(state),
    })
}

// load game from server
function loadGame() {
    fetch(url + 'api/data/' + datakey + '?api-key=c4game')
        .then((response) => response.json())
        .then((response) => response.json())
        .then((data) => {
            state = data
            updateBoard()
        })
}

function saveStateCache() {
    localStorage.clear()
    localStorage.setItem('state', JSON.stringify(state));
}

function loadStateCache() {
    state = JSON.parse(localStorage.getItem('state'));
    updateBoard()
}


