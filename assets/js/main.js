
// ****Global Level Grid Variables***
const gridHeight = 12;
const gridWidth = 16;
const corners = calculateCornerCoordinates(gridHeight, gridWidth);
// ****Global Character Coordinate Variables***
const startMouse = corners[0];
const startCat = [gridWidth / 2, gridHeight / 2];
const startCheese = corners[2];
// ****Global Difficulty Variables***
let diff;
let timeLimit;
let numberOfObstacles;
let catSpeedIntegers;
let timerInterval;
// ****Global Score Variables***
let movesProximity;
let movesTotal;

// trigger event for initialising game once page loads
document.addEventListener('DOMContentLoaded', initializeGame);

// function for initialising game
function initializeGame() {
    diff = sessionStorage.getItem('difficulty');
    if (diff === null) {
        diff = 'easy';
    }
    setDifficultyLevel(diff);
    generateRandomizedLevel(gridHeight, gridWidth, numberOfObstacles);
    drawAsset(startMouse, "mouse");
    drawAsset(startCat, "cat");
    drawAsset(startCheese, "cheese");
    if (checkForAwkwardLevel()) {
        location.reload();
    }
    countdownTimer(timeLimit);
    activateUserControls();
    movesProximity = 0;
    movesTotal = 0;
}

// restart level
function restartLevel(hardReset = false) {
    zeroScore();
    clearInterval(timerInterval);
    if (hardReset != true) {
        toggleGameModal();
    }
    activateUserControls();
    // get the current grid gamestate layout
    const gameState = createGridArray();
    // clear the level
    destroyLevel();
    // redraw the level
    regenerateExistingLevel(gameState);
    drawAsset(startMouse, "mouse");
    drawAsset(startCat, "cat");
    changeCharacterGifAction('cat', 'left');
    drawAsset(startCheese, "cheese");
    countdownTimer(timeLimit);
    movesProximity = 0;
    movesTotal = 0;
}

function checkForAwkwardLevel() {
    const assets = [startMouse, startCat, startCheese];
    let isAwkward = false;
    // check in vicinty of all assets to see if there is an obstacle in the way
    assets.forEach((asset) => {
        let obstacleCount = 0;
        // check immediate up, down, left and right direction for an obstacle 
        if (checkForImmediateObstacle(asset, 'obstacle', 'up')) {
            obstacleCount++;
        }
        if (checkForImmediateObstacle(asset, 'obstacle', 'down')) {
            obstacleCount++;
        }
        if (checkForImmediateObstacle(asset, 'obstacle', 'left')) {
            obstacleCount++;
        }
        if (checkForImmediateObstacle(asset, 'obstacle', 'right')) {
            obstacleCount++;
        }
        if (obstacleCount === 4) {
            isAwkward = true;
        }
    });
    return isAwkward;
}

function regenerateExistingLevel(gameState) {
    const grid = document.getElementById('game-grid');
    for (let i = 0; i < gameState.length; i++) {
        let row = document.createElement('div');
        row.setAttribute('class', 'grid-row');
        for (let j = 0; j < gameState[i].length; j++) {
            let cell = document.createElement('div');
            if (gameState[i][j] === 3) {
                cell.setAttribute('class', 'grid-cell obstacle');
            } else {
                cell.setAttribute('class', 'grid-cell empty');
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
function generateRandomizedLevel(gridHeight, gridWidth, maxObstacles) {
    const grid = document.getElementById('game-grid');
    for (let i = 0; i < gridHeight; i++) {
        let row = document.createElement('div');
        row.setAttribute('class', 'grid-row');
        for (let j = 0; j < gridWidth; j++) {
            let cell = document.createElement('div');
            cell.setAttribute('class', 'grid-cell empty');
            // give the cell attributes representing a coordinate system
            cell.dataset.x = j;
            cell.dataset.y = i;
            // append the cell to the row
            row.appendChild(cell);
        }
        // append the row to the grid
        grid.appendChild(row);
    }
    generateRandomizedObstacles(grid, maxObstacles);

    function generateRandomizedObstacles(grid, maxObstacles) {
        let totalCells = gridHeight * gridWidth;
        let obstacleCount = 0;
        let obstacleAllowed;
        for (let i = 0; i < totalCells; i++) {
            if (obstacleCount < maxObstacles) {
                // probability that the obstacle will occur
                obstacleAllowed = probability(2, 10);
                if (obstacleAllowed) {
                    // generate a random x and y coordinate
                    let randCoord = [Math.floor(Math.random() * gridWidth), Math.floor(Math.random() * gridHeight)];

                    // draw an obstacle at that coordinate
                    fillCell(randCoord[0], randCoord[1], 'obstacle');
                    obstacleCount++;
                }
            }
        }

    }
}

// * adapted from https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
function destroyLevel() {
    const grid = document.getElementById('game-grid');
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }

}

function setDifficultyLevel(level) {
    // highlight the active difficulty in the DOM
    let btnsDiff = document.querySelectorAll('.btn-difficulty-level');
    btnsDiff.forEach(function (btn) {
        if (btn.dataset.diff === level) {
            btn.classList.add('active');
        }
    });
    // internally set the game parameters according to the difficulty
    switch (level) {
        case 'easy':
            timeLimit = 30;
            numberOfObstacles = 10;
            catSpeedIntegers = [90, 100];
            sessionStorage.setItem('difficulty', 'easy');
            break;
        case 'medium':
            timeLimit = 20;
            numberOfObstacles = 30;
            catSpeedIntegers = [95, 100];
            sessionStorage.setItem('difficulty', 'medium');
            break;
        case 'hard':
            timeLimit = 12;
            numberOfObstacles = 80;
            catSpeedIntegers = [100, 100];
            sessionStorage.setItem('difficulty', 'hard');
            break;
    }

}

// **********Asset Generation**********
function drawAsset(position, assetType) {
    emptyCell(position[0], position[1], 'obstacle');
    fillCell(position[0], position[1], assetType);
}

// **********User generated events**********
function activateUserControls() {
    document.addEventListener('keydown', handleKeydown, false);
}

function deactivateUserControls() {
    document.removeEventListener('keydown', handleKeydown, false);
}

function handleKeydown(event) {
    let coordMouse = findCoordinates(1);
    let button = event.key;
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
            updateScore(true);
            toggleGameModal("success");
        }
        // move the cat
        activateEnemyAI();
        // check for defeat
        if (checkForFailure()) {
            updateScore(true);
            toggleGameModal("failure");
        }
    }
}

document.addEventListener('keyup', (event) => {
    //  check for a highlighted key and un-highlight it
    let highlightCheck = document.getElementsByClassName('highlight');
    if (highlightCheck.length > 0) {
        for (let i = 0; i < highlightCheck.length; i++) {
            highlightCheck[i].classList.remove('highlight');
        }
    }
}, false);


function updateScore(endGameMode) {
    let coordMouse = findCoordinates(1);
    let coordCat = findCoordinates(2);
    let distance = calculateDistance(coordCat, coordMouse);
    let incrementScore = 0;
    let currentScore = document.getElementById('score');
    // if the game is over, add the bonus scores
    if (endGameMode) {
        let minsLeft = parseInt(document.getElementById('time-left-mins').textContent);
        let secsLeft = parseInt(document.getElementById('time-left-secs').textContent);
        let totalSecsLeft = minsLeft * 60 + secsLeft;
        // bonus for time left
        incrementScore = incrementScore + totalSecsLeft;
        // bonus for time spent close to cat
        incrementScore = incrementScore + movesProximity;
    } else {  // otherwise calculate if the cat is currently within two blocks from the mouse and increment score if so
        if (Math.abs(distance[0]) <= 1 && Math.abs(distance[1]) <= 1) {
            incrementScore = incrementScore + 50;
            movesProximity++;
        }
    }
    // get the score DOM element and update it
    currentScore.textContent = parseInt(currentScore.textContent) + incrementScore;
}

function zeroScore() {
    movesProximity = 0;
    let currentScore = document.getElementById('score');
    currentScore.textContent = 0;
}

// **********Enemy AI**********
function activateEnemyAI() {
    let coordMouse = findCoordinates(1);
    let coordCat = findCoordinates(2);
    let distance = calculateDistance(coordCat, coordMouse);
    let nextMove = determineInitialCatMove(distance);
    let catMove = probability(catSpeedIntegers[0], catSpeedIntegers[1]);

    // if randomChance is true the cat can move
    if (catMove === true) {
        // move the cat according to the determined next move, if the move was blocked then recalculate
        if (moveCharacter(coordCat, nextMove[0], "cat") === false) {

            let redeterminedMove = determineSecondaryCatMove(coordCat, coordMouse, nextMove);
            moveCharacter(coordCat, redeterminedMove, "cat");
        }
    }

    function determineInitialCatMove(distance) {
        /* Primary decision making function of cat AI:
            Compares the absolute value of the distance of the mouse from the cat
            in the x direction and the y direction
            whichever direction is larger in magnitude, move towards it.
            Returns the determined direction of the move and its axis for the secondary decision making function to use if neccessary.
        */
        let determinedMove;
        let determinedMoveAxis;
        let determinedAction = [];

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
    function determineSecondaryCatMove(coordCat, coordMouse, failedAction) {
        /* Secondary decision making function of cat AI:
        takes the axis of the initial attempted move by the cat and checks the oppsite axis i.e. if the cat was blocked in x direction, the cat then checks y axis for free paths.
        */
        let secondaryMove;

        let oppAxisConverter = {
            x: 'y',
            y: 'x'
        };
        let axisDirectionsConverter = {
            x: ['left', 'right'],
            y: ['up', 'down']
        };

        let oppAxis = oppAxisConverter[failedAction[1]];
        let oppAxisDirections = axisDirectionsConverter[oppAxis];

        // check both directions in the opposite axis to see if they are clear
        let pathCheck = [
            checkForImmediateObstacle(coordCat, 'obstacle', oppAxisDirections[0]),
            checkForImmediateObstacle(coordCat, 'obstacle', oppAxisDirections[1])
        ];
        // with the array of booleans in pathCheck, follow logic:
        // if only one path is clear then move in that direction
        if (pathCheck[0] === true && pathCheck[1] === false) {
            secondaryMove = oppAxisDirections[1];
        } else if (pathCheck[1] === true && pathCheck[0] === false) {
            secondaryMove = oppAxisDirections[0];
        } else if (pathCheck[0] === false && pathCheck[1] === false) {
            // if only both paths are clear then move in the direction on that axis that get the cat closer to the mouse
            // check the distance from the cat on that specified axis
            let distanceOnAxis = calculateDistance(coordCat, coordMouse, oppAxis);
            if (oppAxis === 'x') {
                if (distanceOnAxis > 0) {
                    secondaryMove = 'left';
                } else if (distanceOnAxis < 0) {
                    secondaryMove = 'right';
                }
            } else if (oppAxis === 'y') {
                if (distanceOnAxis > 0) {
                    secondaryMove = 'up';
                } else if (distanceOnAxis < 0) {
                    secondaryMove = 'down';
                }
            }
        } else {
            console.log('theres nowhere for the cat to go');
        }
        return secondaryMove;
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
            changeCharacterGifAction(characterType, "left");
            break;
        case "right":
            newCoordinates[0]++;
            changeCharacterGifAction(characterType, "right");
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
        updateScore(false);
        movesTotal++;
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
        //change the graphic at the success coordinates
        emptyCell(coordVictory[0], coordVictory[1], 'cheese');
        changeCharacterGifAction('mouse', 'win');
        return true;
    } else {
        return false;
    }
}

function checkForFailure() {
    let coordFailure = findCoordinates(6);
    if (coordFailure != 'not found') {
        //change the graphic at the failure coordinates
        changeCharacterGifAction('cat', 'win');
        return true;
    } else {
        return false;
    }
}

// **********Coordinate System Information**********

// Grid array generator: scans the game grid and creates an array which details what asset in each square
// gives the game state
// Identifiers for each character:
// empty = 0, mouse = 1, cat=2, obstacle=3, cheese=4, mouse&cheese=5, cat&mouse=6
function createGridArray() {
    let gridArray = [];
    const rows = document.getElementsByClassName('grid-row');
    for (let row of rows) {
        let gridRow = [];
        Array.from(row.children).forEach((cell) => {
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
    const corners = [];
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
    let requestedCoordinates = [];
    const gameState = createGridArray();
    let found;
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
function calculateDistance(firstPoint, secondPoint, specifiedAxis = null) {
    let distance;

    if (specifiedAxis != null) {
        if (specifiedAxis === 'x') {
            distance = firstPoint[0] - secondPoint[0];
        } else if (specifiedAxis === 'y') {
            distance = firstPoint[1] - secondPoint[1];
        }
    } else {
        distance = [];
        distance[0] = firstPoint[0] - secondPoint[0];
        distance[1] = firstPoint[1] - secondPoint[1];
    }
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
function probability(numerator, denominator) {
    let randomNumberGenerator = Math.floor(Math.random() * (denominator) + 1);
    if (randomNumberGenerator <= numerator) {
        return true;
    } else {
        return false;
    }
}

// **********Game Console information**********
function countdownTimer(inputSeconds) {
    const elementMins = document.getElementById('time-left-mins');
    const elementSecs = document.getElementById('time-left-secs');
    let startCountdownSeconds;
    let startCountdownMinutes = addLeadingZeros(Math.floor(inputSeconds / 60));

    startCountdownSeconds = inputSeconds - (startCountdownMinutes * 60);
    if (startCountdownSeconds === 0) {
        startCountdownMinutes = parseInt(startCountdownMinutes) - 1;
        startCountdownMinutes = addLeadingZeros(startCountdownMinutes);
        startCountdownSeconds = 59;
    }

    elementSecs.textContent = startCountdownSeconds;
    elementMins.textContent = startCountdownMinutes;

    timerInterval = setInterval(function () {
        elementSecs.textContent = addLeadingZeros(parseInt(elementSecs.textContent - 1));

        if (parseInt(elementSecs.textContent) === 0 && parseInt(elementMins.textContent) === 0) {
            clearInterval(timerInterval);
            toggleGameModal('timeup');
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
function toggleGameModal(gameMode) {
    deactivateUserControls();
    clearInterval(timerInterval);
    let modal = document.querySelector(`#main-game-modal`);
    if (gameMode === "success") {
        let percentageProximity = Math.floor(movesProximity / movesTotal * 100);
        let score = parseInt(document.getElementById('score').textContent);
        modal.innerHTML = `
        <h2>You Won!</h2>
        <p>You got the Cheese! <br> Your Score: ${score}</p>
        <p class="details">You spent ${percentageProximity}% of your moves being closely followed by the cat! </p>
        <button class="btn-nav" type="button" onclick="location.reload()">Next Level</button>
        `;
    } else if (gameMode === "failure") {
        modal.innerHTML = `
        <h2>You Lost!</h2>
        <p>The Cat caught you!</p>
        <p class="details">Tip: Try avoiding the cat</p>
        <button class="btn-nav" type="button" onclick="restartLevel()">Restart</button>
        `;
    }
    else if (gameMode === "timeup") {
        modal.innerHTML = `
        <h2>You Lost!</h2>
        <p>You ran out of time!</p>
        <p class="details">Tip: Try going faster</p>
        <button class="btn-nav" type="button" onclick="restartLevel()">Restart</button>
        `;
    }
    modal.classList.toggle('open-game-modal');
}

// CSS Manipulation
function changeCharacterGifAction(character, action) {
    let ruleList = document.styleSheets[1].cssRules;
    for (let i = 0; i < ruleList.length; i++) {
        if (ruleList[i].selectorText === `.${character}`) {
            ruleList[i].style.backgroundImage = `url(../images/${character}-${action}.gif)`;
        }
    }
}
