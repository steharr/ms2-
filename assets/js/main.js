const gridHeight = 10;
const gridWidth = 18;
const corners = calculateCornerCoordinates(gridHeight, gridWidth);
const startMouse = corners[0];
const startCat = [gridWidth / 2, gridHeight / 2];
const startCheese = corners[2];
const timeLimit = 12;

// initialize game
document.addEventListener('DOMContentLoaded', function () {
    generateRandomizedLevel(gridHeight, gridWidth);
    drawAsset(startMouse, "mouse");
    drawAsset(startCat, "cat");
    drawAsset(startCheese, "cheese");
    countdownTimer(timeLimit);
});

// restart level
function restartLevel() {
    // get the current grid gamestate layout
    var gameState = createGridArray();
    // clear the level
    destroyLevel();
    // redraw the level
    regenerateExistingLevel(gameState);
    drawAsset(startMouse, "mouse");
    drawAsset(startCat, "cat");
    drawAsset(startCheese, "cheese");
    countdownTimer(timeLimit);
}

function regenerateExistingLevel(gameState) {
    const grid = document.getElementById('game-grid');
    for (let i = 0; i < gameState.length; i++) {
        var row = document.createElement('div');
        row.setAttribute('class', 'grid-row');
        for (let j = 0; j < gameState[i].length; j++) {
            var cell = document.createElement('div');
            if (gameState[i][j] === 3) {
                cell.setAttribute('class', 'grid-cell outline obstacle');
            } else {
                cell.setAttribute('class', 'grid-cell outline empty');
            }
            // give the cell attributes representing a coordinate system
            cell.dataset.x = j;
            cell.dataset.y = i;
            // append the cell to the row
            row.appendChild(cell);
        }
        // append the row to the grid
        grid.appendChild(row);
    }
}


// Level Generator: creates a game grid based on a given height and width value
// * create rows accord. to height
// * in each row, create multiple cells accord. to width
function generateRandomizedLevel(gridHeight, gridWidth) {
    const grid = document.getElementById('game-grid');

    for (let i = 0; i < gridHeight; i++) {

        var row = document.createElement('div');
        row.setAttribute('class', 'grid-row');

        for (let j = 0; j < gridWidth; j++) {

            var obstacle = randomChance(5, 10);
            var cell = document.createElement('div');

            if (obstacle) {
                cell.setAttribute('class', 'grid-cell outline obstacle');
            } else {
                cell.setAttribute('class', 'grid-cell outline empty');
            }
            // give the cell attributes representing a coordinate system
            cell.dataset.x = j;
            cell.dataset.y = i;
            // append the cell to the row
            row.appendChild(cell);
        }
        // append the row to the grid
        grid.appendChild(row);
    }

}

// * adapted from https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
function destroyLevel() {
    const grid = document.getElementById('game-grid');
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }

}

// **********Asset Generation**********
function drawAsset(position, assetType) {
    emptyCell(position[0], position[1], 'obstacle')
    fillCell(position[0], position[1], assetType);
}


// **********User generated events**********
document.addEventListener('keydown', (event) => {
    var coordMouse = findCoordinates(1);
    var button = event.key;
    if (button === " ") { // regenerate a new level if the user presses space
        location.reload();
    } else { //allow the user to control their character
        if (button === "ArrowDown") {
            moveCharacter(coordMouse, "down", "mouse");
            manipulateArrowKey('down', true);
        } else if (button === "ArrowUp") {
            moveCharacter(coordMouse, "up", "mouse");
            manipulateArrowKey('up', true);
        } else if (button === "ArrowLeft") {
            moveCharacter(coordMouse, "left", "mouse");
            manipulateArrowKey('left', true);
        } else if (button === "ArrowRight") {
            moveCharacter(coordMouse, "right", "mouse");
            manipulateArrowKey('right', true);
        }
        // check for victory
        if (checkForVictory()) {
            location.reload();
        }
        // move the cat
        activateEnemyAI();
        // check for defeat
        if (checkForFailure()) {
            restartLevel();
        }
    }

}, false);

document.addEventListener('keyup', (event) => {
    //  check for a highlighted key and un-highlight it
    let highlightCheck = document.getElementsByClassName('highlight');
    if (highlightCheck.length > 0) {
        for (let i = 0; i < highlightCheck.length; i++) {
            highlightCheck[i].classList.remove('highlight');
        }
    }
}, false);

// **********Enemy AI**********
function activateEnemyAI() {
    let coordMouse = findCoordinates(1);
    let coordCat = findCoordinates(2);
    let distance = calculateDistance(coordCat, coordMouse);
    var nextMove = determineCatMove(distance);

    // var randomChance = Math.floor(Math.random() * 3);
    var catMove = randomChance(1, 1);

    // if randomChance is true the cat can move
    if (catMove === true) {
        // move the cat according to the determined next move, if the move was blocked then recalculate
        if (moveCharacter(coordCat, nextMove[0], "cat") === false) {
            // console.log("the cats blocked direction was along the " + nextMove[1] + " axis")
            switch (nextMove[1]) {
                case 'x':
                    // check the y axis for free entry and go that way
                    if (checkForImmediateObstacle(coordCat, 'obstacle', 'up') === false) {
                        // console.log("the cat decided to try move up");
                        moveCharacter(coordCat, "up", "cat");
                        break;
                    }
                    if (checkForImmediateObstacle(coordCat, 'obstacle', 'down') === false) {
                        // console.log("the cat decided to try move down");
                        moveCharacter(coordCat, "down", "cat");
                        break;
                    }
                    break;
                case 'y':
                    // check the x axis for free entry and go that way
                    if (checkForImmediateObstacle(coordCat, 'obstacle', 'left') === false) {
                        // console.log("the cat decided to try move left");
                        moveCharacter(coordCat, "left", "cat");
                        break;
                    }
                    if (checkForImmediateObstacle(coordCat, 'obstacle', 'right') === false) {
                        // console.log("the cat decided to try move right");
                        moveCharacter(coordCat, "right", "cat");
                        break;
                    }
                    break;
            }
        }
    }
    // compare the absolute value of the distance of the mouse from the cat
    // in the x direction and the y direction
    // whichever direction is larger in magnitude, move towards it
    function determineCatMove(distance) {
        let determinedMove;
        let determinedMoveAxis;
        var determinedAction = [];

        if (Math.abs(distance[0]) > Math.abs(distance[1])) {

            if (distance[0] > 0) {
                determinedMove = "left";
            } else if (distance[0] < 0) {
                determinedMove = "right";
            }
            determinedMoveAxis = "x"; // next move will be attempted in the x axis direction 

        } else if (Math.abs(distance[0]) < Math.abs(distance[1])) {

            if (distance[1] > 0) {
                determinedMove = "up";
            } else if (distance[1] < 0) {
                determinedMove = "down";
            }
            determinedMoveAxis = "y"; // next move will be attempted in the y axis direction 
        }

        determinedAction = [determinedMove, determinedMoveAxis];

        return determinedAction;
    }
}


// **********Movement**********
// Movement function
function moveCharacter(oldCoordinates, moveDirection, characterType) {
    let newCoordinates = [oldCoordinates[0], oldCoordinates[1]];
    // then determine which coordinate needs to be incremented or decremented
    switch (moveDirection) {
        case "up":
            newCoordinates[1]--;
            break;
        case "down":
            newCoordinates[1]++;
            break;
        case "left":
            newCoordinates[0]--;
            break;
        case "right":
            newCoordinates[0]++;
            break;
    }
    // check if there is an obstacle in the way
    let obstacleCheck = checkForObstacle(newCoordinates[0], newCoordinates[1], 'obstacle');
    if (obstacleCheck === false) {
        // first empty the current cell
        emptyCell(oldCoordinates[0], oldCoordinates[1], characterType);
        // then fill cell at adjusted coord
        fillCell(newCoordinates[0], newCoordinates[1], characterType);
        // return a boolean to indicate that the character has successfully moved
        return true;
    } else {
        // return a boolean to indicate that the character has been blocked
        return false;
    }
}


// **********End Game Functions**********
function checkForVictory() {
    let coordVictory = findCoordinates(5);
    if (coordVictory != 'not found') {
        // alert("You won the game!");
        return true;
    } else {
        return false;
    }
}

function checkForFailure() {
    let coordFailure = findCoordinates(6);
    if (coordFailure != 'not found') {
        // alert("You lost the game!");
        return true;
    } else {
        return false;
    }
}

// **********Coordinate System Information**********

// Grid array generator: scans the game grid and creates an array which details what asset in each square
// gives the game state
// Identifiers for each character:
// empty = 0, mouse = 1, cat=2, obstacle=3, cheese=4
function createGridArray() {
    var gridArray = [];
    var rows = document.getElementsByClassName('grid-row');
    for (row of rows) {
        var gridRow = [];
        Array.from(row.children).forEach(function (cell) {
            if (cell.classList.contains('empty')) {
                gridRow.push(0);
            } else if (cell.classList.contains('mouse') && cell.classList.contains('cat')) {
                gridRow.push(6);
            } else if (cell.classList.contains('mouse') && cell.classList.contains('cheese')) {
                gridRow.push(5);
            } else if (cell.classList.contains('cheese')) {
                gridRow.push(4);
            } else if (cell.classList.contains('obstacle')) {
                gridRow.push(3);
            } else if (cell.classList.contains('cat')) {
                gridRow.push(2);
            } else if (cell.classList.contains('mouse')) {
                gridRow.push(1);
            }
        });
        gridArray.push(gridRow);
    }
    return gridArray;
}

// calculates the corner coordinates of the grid so that the level can be generated dynamically more easily
function calculateCornerCoordinates(gridHeight, gridWidth) {
    var corners = [];
    // top left
    corners.push([0, 0]);
    // top right
    corners.push([gridWidth - 1, 0]);
    // bottom right
    corners.push([gridWidth - 1, gridHeight - 1,]);
    // bottom left
    corners.push([0, gridHeight - 1]);
    return corners;
}

// calculates the coordinates of a requested asset
function findCoordinates(assetId) {

    var requestedCoordinates = [];
    var gameState = createGridArray();
    var found;

    for (let i = 0; i < gameState.length; i++) {
        requestedCoordinates[0] = gameState[i].indexOf(assetId);
        if (requestedCoordinates[0] != -1) {
            requestedCoordinates[1] = i;
            found = true;
            break;
        } else {
            found = false;
        }
    }
    if (found == false) {
        requestedCoordinates = 'not found';
    }


    return requestedCoordinates;
}

// calculates axes distances between two points
function calculateDistance(firstPoint, secondPoint) {
    var distance = [];
    distance[0] = firstPoint[0] - secondPoint[0];
    distance[1] = firstPoint[1] - secondPoint[1];
    return distance;
}


// **********DOM Manipulation**********
// highlight an arrow key when one button is pressed
function manipulateArrowKey(direction, highlight) {
    let arrow;

    switch (direction) {
        case 'up':
            arrow = document.getElementById('arrow-up');
            break;
        case 'down':
            arrow = document.getElementById('arrow-down');
            break;
        case 'left':
            arrow = document.getElementById('arrow-left');
            break;
        case 'right':
            arrow = document.getElementById('arrow-right');
            break;
    }
    if (highlight) {
        arrow.classList.add('highlight');
    } else {
        arrow.classList.remove('highlight');
    }
}


// Add a specified class to a specified cell
function fillCell(xCoord, yCoord, fillClass) {
    let targetCell = document.querySelector(`[data-x='${xCoord}'][data-y='${yCoord}']`);
    let cellClasses = targetCell.classList;
    if (cellClasses.contains('empty')) {
        targetCell.classList.remove('empty');
    }
    targetCell.classList.add(fillClass);
}
// Remove a specified class to a specified cell
function emptyCell(xCoord, yCoord, emptyClass) {
    let targetCell = document.querySelector(`[data-x='${xCoord}'][data-y='${yCoord}']`);
    let cellClasses = targetCell.classList;
    if (cellClasses.contains(emptyClass)) {
        targetCell.classList.remove(emptyClass);
    }
    targetCell.classList.add('empty');
}
// Check for the prescence a specified class to a specified cell
function checkForObstacle(xCoord, yCoord, obstacleClass) {

    let targetCell = document.querySelector(`[data-x='${xCoord}'][data-y='${yCoord}']`);

    if (targetCell === null) {
        return true; // if the cell doesnt exist return false
    }

    let cellClasses = targetCell.classList;
    if (cellClasses.contains(obstacleClass)) {
        return true; // if the cell does exist and it contains the class return true
    } else {
        return false; //else return false
    }
}

function checkForImmediateObstacle(currentCoords, obstacleClass, direction) {
    let xCoordCheck;
    let yCoordCheck;
    switch (direction) {
        case "up":
            yCoordCheck = currentCoords[1] - 1;
            xCoordCheck = currentCoords[0];
            break;
        case "down":
            yCoordCheck = currentCoords[1] + 1;
            xCoordCheck = currentCoords[0];
            break;
        case "left":
            xCoordCheck = currentCoords[0] - 1;
            yCoordCheck = currentCoords[1];
            break;
        case "right":
            xCoordCheck = currentCoords[0] + 1;
            yCoordCheck = currentCoords[1];
            break;
    }

    let targetCell = document.querySelector(`[data-x='${xCoordCheck}'][data-y='${yCoordCheck}']`);

    if (targetCell === null) {
        return true; // if the cell doesnt exist return false
    }

    let cellClasses = targetCell.classList;
    if (cellClasses.contains(obstacleClass)) {
        return true; // if the cell does exist and it contains the class return tue
    } else {
        return false; //else return false
    }

}

// **********Misc Functions**********
function randomChance(divider, limit) {
    var randomChance = Math.floor(Math.random() * limit);
    if (randomChance % divider === 0) {
        return true;
    } else {
        return false;
    }
}

// **********Game Console information**********
function countdownTimer(inputSeconds) {
    const elementMins = document.getElementById('time-left-mins');
    const elementSecs = document.getElementById('time-left-secs');
    var startCountdownSeconds;
    var startCountdownMinutes = addLeadingZeros(Math.floor(inputSeconds / 60));

    startCountdownSeconds = inputSeconds - (startCountdownMinutes * 60)
    if (startCountdownSeconds === 0) {
        startCountdownMinutes = parseInt(startCountdownMinutes) - 1;
        startCountdownMinutes = addLeadingZeros(startCountdownMinutes);
        startCountdownSeconds = 59;
    }

    elementSecs.textContent = startCountdownSeconds;
    elementMins.textContent = startCountdownMinutes;

    var timerInterval = setInterval(function () {
        // let decrementedSeconds = addLeadingZeros(parseInt(elementSecs.textContent - 1));
        elementSecs.textContent = addLeadingZeros(parseInt(elementSecs.textContent - 1));

        if (parseInt(elementSecs.textContent) === 0 && parseInt(elementMins.textContent) === 0) {
            clearInterval(timerInterval);
            alert('times up!');
            restartLevel();
        } else if (parseInt(elementSecs.textContent) === 0) {
            elementMins.textContent = addLeadingZeros(parseInt(elementMins.textContent - 1));
            elementSecs.textContent = 59;
        }

    }, 1000);
}


function addLeadingZeros(number) {
    if (number < 10) {
        return "0" + number;
    } else {
        return number;
    }
}