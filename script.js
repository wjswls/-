window.addEventListener("resize", resizeSvg);



let myButton = document.getElementById('playButton');
myButton.onclick = function () {
    play();
}

let replay = document.getElementById('replay');

let visibility, mobility, diversity;

function disableVisSlider() {
  let slider = document.getElementById('visibility');
  slider.disabled = true;
  visibility = slider.value;
  document.getElementById("visibilityValue").textContent = visibility;
}

function disableMobSlider() {
  let slider = document.getElementById('mobility');
  slider.disabled = true;
  mobility = slider.value;
  document.getElementById("mobilityValue").textContent = mobility;
}

function disableDivSlider() {
  let slider = document.getElementById('diversity');
  slider.disabled = true;
  diversity = slider.value;
  document.getElementById("diversityValue").textContent = diversity;
}

function storeAndDisable() {
  disableVisSlider();
  disableMobSlider();
  disableDivSlider();
  console.log('Visibility:', visibility);
  console.log('Mobility:', mobility);
  console.log('Diversity:', diversity);
}

let startTime = Date.now();

let screenWidth = window.innerWidth / 1.5;
let screenHeight = window.innerHeight / 1.5;

const svg = document.getElementById('basesvg');
svg.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);

let bbox = svg.getBoundingClientRect();

function resizeSvg() {
    svg.setAttribute("viewBox", `0 0 ${bbox.width} ${bbox.height}`);
}

//svg canvas width
let width = bbox.width;
let height = bbox.height;

//svg canvas height
let centreX = width / 2;
let centreY = height / 2;

//variables
let gridWidth = 20;
let gridHeight = 10;

let rows = 50;
let cols = 50;

const colors = {
    yellow: [252, 186, 3],
    aqua: [127, 255, 212],
    lightpink: [255, 182, 193],
    blue: [2, 202, 247],
    red: [242, 70, 85],
    purple: [232, 105, 255],
    green: [134, 237, 130],
    grey: [209, 209, 209],
    plum: [221, 160, 221],
}


///classes
class Tile {
    constructor(x, y, hasBuilding) {
        this.x = x;
        this.y = y;
        this.svgElement;
        this.hasBuilding = hasBuilding;
        this.buildingHeight;
        this.buildingColor = colorPicker(diversity);
        this.buildingSVG = drawBlock(this.x, this.y, this.buildingHeight, this.buildingColor);

        //mark if the tile needs to destory its current building, build or left;
        this.toBeDistroyed = false;
        this.toBeConstructed = true;
        this.toBeLeft = false;
    }
    getX() {
        return this.x * gridWidth;
    }
    getY() {
        return this.y * gridHeight;
    }

    drawTile() {
        this.svgElement = makeDiamond(this.x, this.y, "white");
        svg.appendChild(this.svgElement);
    }

    drawBuilding(begin) {
        this.buildingSVG = drawBlock(this.x, this.y, this.buildingHeight, this.buildingColor);
        svg.appendChild(this.buildingSVG);
        this.addBuildingAnimation(begin);
        this.toBeConstructed = false;
    }
    drawStay() {
        this.buildingSVG = drawBlock(this.x, this.y, this.buildingHeight, this.buildingColor);
        svg.appendChild(this.buildingSVG);
    }

    destroyBuilding(begin) {
        this.addDestroyAnimation(begin);
    }

    addBuildingAnimation(begin) {
        let delay1 = 0.1;
        let delay2 = 0.2;
        let delay3 = 0.4;
        begin = begin - 200;

        this.animateWall(this.buildingSVG.children[0], delay1, begin);
        this.animateWall(this.buildingSVG.children[1], delay2, begin);
        this.animateWall(this.buildingSVG.children[2], delay3, begin);
    }

    addDestroyAnimation(begin) {
        let delay1 = 0.2;
        let delay2 = 0.4;
        let delay3 = 0.6;
        begin = begin - 200;

        this.animateWallDestroy(this.buildingSVG.children[2], delay1, begin);
        this.animateWallDestroy(this.buildingSVG.children[1], delay2, begin);
        this.animateWallDestroy(this.buildingSVG.children[0], delay3, begin);
    }

    animateWall(svgChild, time, begin) {
        let animElement = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animElement.setAttribute('attributeName', "opacity");
        animElement.setAttribute("values", `0; 0; 1; 1;`);
        animElement.setAttribute("begin", `${begin}ms`);
        animElement.setAttribute("dur", "0.6s");
        animElement.setAttribute('keyTimes', `0; ${time - 0.1}; ${time + 0.1}; 1`);
        svgChild.appendChild(animElement);
    }

    animateWallDestroy(svgChild, time, begin) {
        let animElement = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animElement.setAttribute('attributeName', "opacity");
        animElement.setAttribute("values", `1; 1; 0; 0;`);
        animElement.setAttribute("begin", `${begin}ms`);
        animElement.setAttribute("dur", "0.3s");
        animElement.setAttribute('keyTimes', `0; ${time - 0.05}; ${time}; 1`);
        animElement.setAttribute("fill", "freeze");
        svgChild.appendChild(animElement);
    }

    tick(tileArray, visibility, mobility) {
        let color = this.buildingColor;
        let maxHeightTile = null;
        let maxHeight = this.buildingHeight;
        let isTallest = true;

        // Search for the tile with the highest building of the same color within the visibility range
        for (let i = this.y - visibility; i <= this.y + visibility; i++) {
            for (let j = this.x - visibility; j <= this.x + visibility; j++) {
                if (i === this.y && j === this.x) {
                    continue;
                }

                if (i >= 0 && i < tileArray.length && j >= 0 && j < tileArray[i].length) {
                    const tile = tileArray[i][j];
                    if (tile.buildingColor === color) {
                        if (tile.buildingHeight > maxHeight) {
                            maxHeightTile = tile;
                            maxHeight = tile.buildingHeight;
                            isTallest = false;
                        }
                    }
                }
            }
        }

        if (isTallest) {
            this.toBeLeft = true;
            this.toBeDistroyed = false;
            this.toBeConstructed = false;
            return;
        }

        if (this.hasTwoSameColorNeighbors(tileArray)) {
            this.toBeLeft = true;
            this.toBeDistroyed = false;
            this.toBeConstructed = false;
            return;
        }

        if (maxHeightTile != null) {
            let targetTile = this.getClosestEmptyTile(tileArray, maxHeightTile, mobility);
            if (targetTile == null) {
                this.hasBuilding = true;
                this.toBeLeft = true;
                this.toBeDistroyed = false;
                this.toBeConstructed = false;
                return;
            } else if (targetTile.x == this.x && targetTile.y == this.y) {
                this.hasBuilding = true;
                this.toBeLeft = true;
                this.toBeDistroyed = false;
                this.toBeConstructed = false;
                return;
            } else {
                let targetX = targetTile.x;
                let targetY = targetTile.y;
                tileArray[targetX][targetY].buildingHeight = this.buildingHeight;
                tileArray[targetX][targetY].buildingColor = this.buildingColor;
                tileArray[targetX][targetY].hasBuilding = true;
                tileArray[targetX][targetY].toBeConstructed = true;
                tileArray[targetX][targetY].toBeDistroyed = false;
                tileArray[targetX][targetY].toBeLeft = false;
                tileArray[targetX][targetY].toBeDistroyed = false;
                this.toBeDistroyed = true;
                this.toBeConstructed = false;
                this.toBeLeft = false;

            }
        }
    }

    getClosestEmptyTile(tileBoard, targetTile, mobility) {
        // Calculate distance to targetTile
        let dx = targetTile.x - this.x;
        let dy = targetTile.y - this.y;
        let distanceToTarget = Math.sqrt(dx * dx + dy * dy);

        // If the target is within mobility range and is empty, return the target tile
        if (distanceToTarget <= mobility && !targetTile.hasBuilding) {
            return targetTile;
        }

        // Find the closest empty tile within mobility range
        let closestEmptyTile = null;
        let minDistance = Infinity;

        // Iterate over all tiles within mobility range
        for (let i = Math.max(0, this.x - mobility); i <= Math.min(tileBoard.length - 1, this.x + mobility); i++) {
            for (let j = Math.max(0, this.y - mobility); j <= Math.min(tileBoard[i].length - 1, this.y + mobility); j++) {
                let tile = tileBoard[i][j];

                // Skip tiles with buildings
                if (tile.hasBuilding) {
                    continue;
                }

                // Calculate distance to target tile
                let dx = targetTile.x - tile.x;
                let dy = targetTile.y - tile.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                // If this tile is closer to the target than the current closest tile, update the closest tile
                if (distance < minDistance) {
                    minDistance = distance;
                    closestEmptyTile = tile;
                }
            }
        }

        // Return the closest empty tile (null if no such tile is found)
        return closestEmptyTile;
    }



    hasTwoSameColorNeighbors(tileBoard) {
        // Define the coordinates of the surrounding tiles
        let surroundingCoords = [
            [-1, 0], // above
            [1, 0],  // below
            [0, -1], // left
            [0, 1],  // right
        ];

        let sameColorCount = 0;

        // Check each surrounding tile
        for (let coords of surroundingCoords) {
            let i = this.x + coords[0];
            let j = this.y + coords[1];

            // Skip if outside the tile board
            if (i < 0 || i >= tileBoard.length || j < 0 || j >= tileBoard[i].length) {
                continue;
            }

            let tile = tileBoard[i][j];

            // If the tile has a building and the building's color is the same, increment sameColorCount
            if (tile.hasBuilding && tile.buildingColor === this.buildingColor) {
                sameColorCount++;
                if (sameColorCount >= 2) {
                    return true;
                }
            }
        }

        // Not enough surrounding tiles with the same color
        return false;
    }

}

function makeGridArray(rows, cols) {
    let gridArray = [];
    for (let i = 0; i < rows; i++) {
        gridArray[i] = [];
        for (let j = 0; j < cols; j++) {
            gridArray[i][j] = (new Tile(i, j, getRandomBoolean()));
        }
    }
    return gridArray;
}


//grid and coloumns setup

const gridArray1 = makeGridArray(rows, cols);
let backgroundGrid = makeGridArray(rows, cols);
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        backgroundGrid[i][j].drawTile();
    }
}

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        if (gridArray1[i][j].hasBuilding) {
            gridArray1[i][j].buildingHeight = getRandom(20, 130);
            gridArray1[i][j].buildingColor = colorPicker(diversity);
        }
    }
}


let t = 500;
setup();

////////Main functions;
function setup() {

    setTimeout(draw, t);
}

function clearGame(){
    svg.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
}

function getElapsedTime() {
    return Date.now() - startTime;
}

function draw() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (gridArray1[i][j].toBeConstructed) {
                gridArray1[i][j].buildingColor = gridArray1[i][j].buildingColor;
                gridArray1[i][j].drawBuilding(getElapsedTime());
                gridArray1[i][j].toBeConstructed = true;
            }
            if (gridArray1[i][j].toBeLeft) {
                gridArray1[i][j].buildingColor = gridArray1[i][j].buildingColor;
                gridArray1[i][j].drawStay();
                gridArray1[i][j].toBeLeft = false;
                gridArray1[i][j].hasBuilding = true;
            }

        }
    }
}

function destroy() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (gridArray1[i][j].toBeDistroyed) {
                gridArray1[i][j].destroyBuilding(getElapsedTime());
            }
        }
    }
}

function deleteDestroy() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (gridArray1[i][j].toBeDistroyed || !gridArray1[i][j].hasBuilding) {
                svg.appendChild(gridArray1[i][j].buildingSVG);
                svg.removeChild(gridArray1[i][j].buildingSVG);
                gridArray1[i][j].toBeDistroyed = false;
                gridArray1[i][j].hasBuilding = false;
            }
        }
    }
}

function calculate() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (gridArray1[i][j].hasBuilding) {
                gridArray1[i][j].tick(gridArray1, visibility, mobility);
            }
        }
    }
}

function clear() {
    let box = generateNewSVG();
    svg.appendChild(box);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            backgroundGrid[i][j].drawTile();
        }
    }
}

function play() {
    console.log("pressed");

    calculate();
    destroy();
    setTimeout(deleteDestroy, 800);
    setTimeout(draw, 1000);
}

