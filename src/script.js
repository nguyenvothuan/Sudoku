import gameGenerator from "./gameGenerator";
import './style.css';
var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;


window.onload = function () {
    id("start-btn").addEventListener("mousedown", startGame);
    for (let i = 0; i < 9; i++) {
        id("number-container").children[i].addEventListener("click", function () {
            if (!disableSelect) {
                if (this.classList.contains("selected")) {
                    this.classList.remove("selected");
                    selectedNum = null;
                }
                else {
                    for (let j = 0; j < 9; j++) {//search and remove the previously selected tile
                        id("number-container").children[j].classList.remove("selected");
                    }
                    this.classList.add("selected");
                    selectedNum = this;
                    updateMove();
                }

            }
        });
    }
}

function id(id) {
    return document.getElementById(id);
}
let board, solution;
function startGame() {
    //choose difficulty
    if (id("diff-1").checked) {
        [board, solution] = gameGenerator('easy')
    }
    else if (id("diff-2").checked) [board, solution] = gameGenerator('medium')
    else[board, solution] = gameGenerator('hard');



    lives = 3;
    disableSelect = false;
    id("live").textContent = "Lives Remaining: 3";
    generateBoard(board);
    startTimer();
    if (id("theme-1").checked) {
        qs("body").classList.remove("dark");
    } else {
        qs("body").classList.add("dark");
    }
    id("number-container").classList.remove("hidden");
}
function startTimer() {
    if (id("time-1").checked) timeRemaining = 180;
    else if (id("time-2").checked) timeRemaining = 300;
    else timeRemaining = 600;
    id("timer").textContent = timeConversion(timeRemaining);
    timer = setInterval(function () {
        timeRemaining--;
        if (timeRemaining == 0) endGame();
        id("timer").textContent = timeConversion(timeRemaining)
    }, 1000)
}

function timeConversion(time) {
    //MM:SS format
    let min = Math.floor(time / 60);
    if (min < 10) min = "0" + min;
    let sec = time % 60;
    if (sec < 10) sec = "0" + sec;
    return min + ':' + sec;
}

function generateBoard(board) {
    clearPrevious();
    let idCount = 0;
    //81 tiles created
    for (let i = 0; i < 81; i++) {
        let tile = document.createElement("p");

        if (board.charAt(i) != "-") {
            tile.textContent = board.charAt(i);
            tile.classList.add("given")
        }
        else {
            tile.addEventListener("click", () => {
                if (!disableSelect) { //if some shit is chosen
                    if (tile.classList.contains("selected")) {
                        tile.classList.remove("selected");
                        selectedTile = null;

                    } else { //remove all
                        for (i = 0; i < 81; i++) {
                            qsa(".tile")[i].classList.remove("selected");

                        }
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }

                }
            })
        }
        tile.id = idCount;
        idCount++;
        tile.classList.add("tile");
        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
            tile.classList.add("bottomBorder");
        }
        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add("rightBorder");
        }
        id("board").appendChild(tile);
    }
    console.log("new board created")
}

function updateMove() {
    if (selectedTile && selectedNum) {
        //set the tile to the correct number
        selectedTile.textContent = selectedNum.textContent;
        if (checkCorrect(selectedTile)) {
            //deselect the tile
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            selectedNum = null;
            selectedTile = null; //selected tile is true, reset selected and await for the next click
            if (checkDone()) {
                console.log('really');
                endGame();
            }
        } else {//if guess is wrong
            disableSelect = true;
            selectedTile.classList.add("incorrect");
            setTimeout(function () {
                lives--;
                if (lives === 0) endGame();
                else {
                    id("live").textContent = "Lives Remaining: " + lives;
                    disableSelect = false;
                }
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");
                selectedTile.textContent = "";
                selectedNum = null;
                selectedTile = null;


            }, 1000)
        }
    }

}
function checkDone() {
    let tiles = qsa(".tile");
    let reallyDone = true;
    tiles.forEach(tile => {
        if (tile.textContent === '' || tile.textContent === null)
        {
            reallyDone=false;
        }
    })
    return reallyDone;
}
function endGame() {
    disableSelect = true;
    clearTimeout(timer);
    if (lives === 0 || timeRemaining === 0) {
        id("live").textContent = "Wasted!";
    } else {
        id("live").textContent = "Victory!";
    }
}

function checkCorrect(tile) {
    if (solution.charAt(tile.id) === tile.textContent)
        return true;
    return false;
}
function clearPrevious() {
    console.log("clear previous");
    let tiles = qsa(".tile");
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }
    if (timer) clearTimeout(timer);
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected")
    }
    selectedTile = null;
    selectedNum = null;
}
function qs(selector) {
    return document.querySelector(selector);
}
function qsa(selector) {
    return document.querySelectorAll(selector);
}
