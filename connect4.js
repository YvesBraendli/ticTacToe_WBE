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

//TODO - Undobutton
function undo() {
    if (stateSeq.length > 0) {
        state = stateSeq.pop()
        updateBoard()
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

const App = () => [Board, {
    board: state.board
}]

const Board = ({ board }) => {
    let flatBoard = [].concat(...board)
    let fields = flatBoard.map((type) => [Field, {
        type
    }])
    return (
        ["div", {
            className: "board"
        }, ...fields]
    )
}

const Field = ({ type }) => {
    let piece = ""
    if (type != '') {
        piece = ["div", {
            className: "piece " + color(type)
        }]
    }
    return ["div", {
        className: "field"
    }, piece]
}

const color = (type) => {
    switch (type) {
        case 'r':
            return 'red'
        case 'b':
            return 'blue'
    }
}

//Entry Point - loading the board - called from HTML file
function showBoard() {
    generateBoard()

    // let appRoot = document.body;
    // let element =
    //     ["div", {class: "board", id: "board"},
    //         ["div", {class: "field", id: "00", onClick: "clickOnField(0,0)"}],
    //         ["div", {class: "field", id: "01", onClick: "clickOnField(0,1)"}],
    //         ["div", {class: "field", id: "02", onClick: "clickOnField(0,2)"}],
    //         ["div", {class: "field", id: "03", onClick: "clickOnField(0,3)"}],
    //         ["div", {class: "field", id: "04", onClick: "clickOnField(0,4)"}],
    //         ["div", {class: "field", id: "05", onClick: "clickOnField(0,5)"}],
    //         ["div", {class: "field", id: "06", onClick: "clickOnField(0,6)"}],
    //         ["div", {class: "field", id: "10", onClick: "clickOnField(1,0)"}],
    //         ["div", {class: "field", id: "11", onClick: "clickOnField(1,1)"}],
    //         ["div", {class: "field", id: "12", onClick: "clickOnField(1,2)"}],
    //         ["div", {class: "field", id: "13", onClick: "clickOnField(1,3)"}],
    //         ["div", {class: "field", id: "14", onClick: "clickOnField(1,4)"}],
    //         ["div", {class: "field", id: "15", onClick: "clickOnField(1,5)"}],
    //         ["div", {class: "field", id: "16", onClick: "clickOnField(1,6)"}],
    //         ["div", {class: "field", id: "20", onClick: "clickOnField(2,0)"}],
    //         ["div", {class: "field", id: "21", onClick: "clickOnField(2,1)"}],
    //         ["div", {class: "field", id: "22", onClick: "clickOnField(2,2)"}],
    //         ["div", {class: "field", id: "23", onClick: "clickOnField(2,3)"}],
    //         ["div", {class: "field", id: "24", onClick: "clickOnField(2,4)"}],
    //         ["div", {class: "field", id: "25", onClick: "clickOnField(2,5)"}],
    //         ["div", {class: "field", id: "26", onClick: "clickOnField(2,6)"}],
    //         ["div", {class: "field", id: "30", onClick: "clickOnField(3,0)"}],
    //         ["div", {class: "field", id: "31", onClick: "clickOnField(3,1)"}],
    //         ["div", {class: "field", id: "32", onClick: "clickOnField(3,2)"}],
    //         ["div", {class: "field", id: "33", onClick: "clickOnField(3,3)"}],
    //         ["div", {class: "field", id: "34", onClick: "clickOnField(3,4)"}],
    //         ["div", {class: "field", id: "35", onClick: "clickOnField(3,5)"}],
    //         ["div", {class: "field", id: "36", onClick: "clickOnField(3,6)"}],
    //         ["div", {class: "field", id: "40", onClick: "clickOnField(4,0)"}],
    //         ["div", {class: "field", id: "41", onClick: "clickOnField(4,1)"}],
    //         ["div", {class: "field", id: "42", onClick: "clickOnField(4,2)"}],
    //         ["div", {class: "field", id: "43", onClick: "clickOnField(4,3)"}],
    //         ["div", {class: "field", id: "44", onClick: "clickOnField(4,4)"}],
    //         ["div", {class: "field", id: "45", onClick: "clickOnField(4,5)"}],
    //         ["div", {class: "field", id: "46", onClick: "clickOnField(4,6)"}],
    //         ["div", {class: "field", id: "50", onClick: "clickOnField(5,0)"}],
    //         ["div", {class: "field", id: "51", onClick: "clickOnField(5,1)"}],
    //         ["div", {class: "field", id: "52", onClick: "clickOnField(5,2)"}],
    //         ["div", {class: "field", id: "53", onClick: "clickOnField(5,3)"}],
    //         ["div", {class: "field", id: "54", onClick: "clickOnField(5,4)"}],
    //         ["div", {class: "field", id: "55", onClick: "clickOnField(5,5)"}],
    //         ["div", {class: "field", id: "56", onClick: "clickOnField(5,6)"}],
    //     ]
    //renderSJDON(element, appRoot)

    switchPlayer() // just to set the subtitle of current player
}

const generateBoard = function () {
    let app = document.querySelector(".app")
    render([App], app)
    for (let r = 0; r < BOARD_ROW; r++) {
        for (let c = 0; c < BOARD_COL; c++) {
            let field = elt("div", {class: "field", id: `${r}${c}`})
            app.addEventListener('click', function (event) {
                clickOnField(r, c)
            })
            document.getElementById("board").append(app)
        }
    }
}

function renderSJDON(element, appRoot) {
    appRoot.appendChild(generate(element))
}

//function auslagern damit man rekursiv aufrufen kann
function generate(list) {
    let root = undefined

    for (let i = 0; i < list.length; i++) {
        console.log(list[i])
    }

    //Loop all elements
    for (let i = 0; i < list.length; i++) {

        //first element is root element
        if (i == 0) {
            console.log(list[i])
            root = document.createElement(list[i])
            continue;
        }

        //Handle string
        if (typeof (list[i]) === "string") {
            console.log(list[i])
            let text = document.createTextNode(list[i])
            root.appendChild(text)
            continue
        }

        //Handle Html Attributes
        if (typeof (list[i]) === "object" && !Array.isArray(list[i])) {
            console.log(list[i])
            for (item in list[i]) {
                root.setAttribute(item, list[i][item])
            }
            continue
        }

        //Handle Array
        if (Array.isArray(list[i])) {
            let node = generate(list[i])
            root.appendChild(node)
            continue
        }
    }
    return root
}

function newGame() {

    state = {
        board: Array(BOARD_ROW).fill('').map(el => Array(BOARD_COL).fill('')),
        activePlayer: PLAYER_BLUE,
        gameOver: false
    }

    const myNode = document.getElementById("board");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }
    generateBoard();
    switchPlayer();

}

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

function clickOnField(row, col) {
    //console.log(`field r${row}-c${col} was clicked`);

    stateSeq.push(state)
    //TODO variable soll gesetzt werden, wenn ein sieger ermittelt wurde
    if (state.gameOver) {
        return;
    }

    // CHECK if current col is already full
    if (state.board[0][col] !== '') {
        alert("Ups, hier passt kein Stein mehr rein!");
        return;
    }

    // EDIT caller row to next free row, so we can stack the coins
    //console.log(`row = ${row} to start finding next free row`)
    for (row = BOARD_ROW - 1; row >= 0; row--) {
        //console.log(`checking r${row} in c${col} whether it is empty: ${(state[row][col] == '')}`)
        if (state.board[row][col] == '') {
            //console.log(`next free row at ${row}${col}`);
            break
        }
    }

    // EDIT the board state with the players color
    //state.board[row][col] = state.activePlayer


    // Code for setting new state without affecting old state
    state = setInObj(state, "board", setInList(state.board, row, setInList(state.board[row], col % 7, state.activePlayer)))

    // CREATE new chip element and add it to the HTML
    let chip = elt("div", {class: `${state.activePlayer} piece`})
    console.log(chip)
    document.getElementById(`${row}${col}`).append(chip)

    switchPlayer()
    checkWinner()
}

function switchPlayer() {
    state.activePlayer = players[(players.indexOf(state.activePlayer) + 1) % players.length]
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
    console.log(`winner is ${state.board[r][c]} at r${r}c${c}`)
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

//  Get current state from server and re-draw board
//
function loadState() {

    fetch(url + 'api/data/' + datakey + '?api-key=c4game')
        .then((response) => response.json())
        .then((data) => {
            console.log('got back response:', data)
            state = data
            updateBoard()
        })
}

// display board state in UI
function updateBoard() {
    const board = document.querySelector('.board')
    board.textContent = ''
    for (let r = 0; r < BOARD_ROW; r++) {
        for (let c = 0; c < BOARD_COL; c++) {
            let cell
            if (state.board[r][c] === 'Blau')
                cell = elt('div', {class: "field", id: `${r}${c}`}, elt('div', {class: 'Blau piece'}))
            else if (state.board[r][c] === 'Rot')
                cell = elt('div', {class: "field", id: `${r}${c}`}, elt('div', {class: 'Rot piece'}))
            else cell = elt('div', {class: "field", id: `${r}${c}`})
            // add event listener for all cells
            cell.addEventListener('click', function (event) {
                clickOnField(r, c)
            }) // i --> column nr
            board.appendChild(cell)
        }
    }

    // game over state
    checkWinner()

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
        .then((data) => {
            console.log('got back response:', data)
            state = data
            updateBoard()
        })
}

function saveStateCache() {
    localStorage.setItem('state', JSON.stringify(state));
}

function loadStateCache() {
    storage = localStorage.getItem('state');
    state = JSON.parse(storage);
    updateBoard()
}
