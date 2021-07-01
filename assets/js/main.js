var grid = document.getElementById('game-grid');

document.addEventListener('DOMContentLoaded', function () {
    const gridHeight = 20;
    const gridWidth = 50;

    generateLevel(gridHeight, gridWidth);

});

// Level generator: creates a game grid based on a given height and width value
// create rows accord. to height
// in each row, create cells accord. to width
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
