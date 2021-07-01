var grid = document.getElementById('game-grid');

// initialize game
document.addEventListener('DOMContentLoaded', function () {
    const gridHeight = 20;
    const gridWidth = 50;
    const startMouse = [0, 0];
    const startCat = [0, gridHeight - 1];
    const startCheese = [gridWidth - 1, gridHeight - 1];

    generateLevel(gridHeight, gridWidth);
    drawAsset(startMouse, "mouse");
    drawAsset(startCat, "cat");
    drawAsset(startCheese, "cheese");
});

// Level Generator: creates a game grid based on a given height and width value
// * create rows accord. to height
// * in each row, create multiple cells accord. to width
function generateLevel(gridHeight, gridWidth) {
    for (let i = 0; i < gridHeight; i++) {
        var row = document.createElement('div');
        row.setAttribute('class', 'grid-row');
        for (let j = 0; j < gridWidth; j++) {
            var cell = document.createElement('div');
            cell.setAttribute('class', 'grid-cell outline empty');
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

// Characters
function drawAsset(startPosition, assetType) {
    fillCell(startPosition[0], startPosition[1], assetType);
}


// Coordinate System Information
function createGridArray() {
    var gridArray = [];
    var rows = document.getElementsByClassName('game-box-row');
    for (row of rows) {
        var gridRow = [];
        Array.from(row.children).forEach(function (cell) {
            if (cell.className.includes('empty')) {
                gridRow.push(0);
            } else if (cell.className.includes('mouse')) {
                gridRow.push(1);
            } else if (cell.className.includes('cat')) {
                gridRow.push(2);
            } else if (cell.className.includes('cheese')) {
                gridRow.push(3);
            } else if (cell.className.includes('obstacle')) {
                gridRow.push(4);
            }
        });
    }

}

// DOM Manipulation
function fillCell(xCoord, yCoord, fillClass) {
    let targetCell = document.querySelector(`[data-x='${xCoord}'][data-y='${yCoord}']`)
    if (targetCell.className.includes('empty')) {
        targetCell.classList.remove('empty');
    }
    targetCell.classList.add(fillClass);
}
function emptyCell(xCoord, yCoord, emptyClass) {
    let targetCell = document.querySelector(`[data-x='${xCoord}'][data-y='${yCoord}']`)
    if (targetCell.className.includes(emptyClass)) {
        targetCell.classList.remove(emptyClass);
    }
    targetCell.classList.add('empty');
}
