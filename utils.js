



const colors = {
    yellow: [252, 186, 3],
    aqua:[127, 255, 212],
    lightpink: [255, 182, 193],
    blue: [2, 202, 247],
    red: [242, 70, 85],
    purple: [232, 105, 255],
    green: [134, 237, 130],
    grey: [209, 209, 209],
    plum: [221, 160, 221],
}

let screenWidth = window.innerWidth / 1.5;
let screenHeight = window.innerHeight;

//generate number
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


let gridWidth = 20;
let gridHeight = 10;
let x_start = screenWidth / 4;
let y_start = screenHeight / 4;


// if random has no variable it will generate a number random from 0 and 1
function random() {
    switch (arguments.length) {
        case 0:
            return Math.random();
            break;
        case 1:
            return Math.random() * arguments[0];
            break;
        case 2:
            return arguments[0] + Math.random() * (arguments[1] - arguments[0]);
            break;
        default:
            console.error("too many arguments passed to random()");
            break;
    }
}

//generate rgb
function getRGB() {
    let red = getRandom(0, 255);
    let green = getRandom(0, 255);
    let blue = getRandom(0, 255);
    return `rgb(${red},${green},${blue})`
}

//draw circle
function makeCircle(x, y, radius) {
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", getRGB());
    return circle;
}


//make Square
function makeSquare(x, y, width, height) {
    let newSquare = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    newSquare.setAttribute("x", x);
    newSquare.setAttribute("y", y);
    newSquare.setAttribute("width", width);
    newSquare.setAttribute("height", height);
    newSquare.setAttribute("fill", getRGB());
    return newSquare;
}

function generateNewSVG(){
    let blankSheet = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    blankSheet.setAttribute("x", 0);
    blankSheet.setAttribute("y", 0);
    blankSheet.setAttribute("width", 10000);
    blankSheet.setAttribute("height", 10000);
    blankSheet.setAttribute("fill", 'rgb(0,0,0)');
    return blankSheet;
}

//gets centre point cx, cy and rotates them by 'angle'
function rotate(angle, xInput, yInput) {
    let angleOutput = angle;
    let xOutput = xInput;
    let yOutput = yInput;
    return `rotate(${angleOutput},${xOutput},${yOutput})`;
}

//make rgb line
function makeRGB(redInputValue, greenInputValue, blueInputValue) {
    let redOutputValue = redInputValue ?? getRandom(0, 255);
    let greenOutputValue = greenInputValue ?? getRandom(0, 255);
    let blueOutputValue = blueInputValue ?? getRandom(0, 255);
    return `rgb(${redOutputValue},${greenOutputValue},${blueOutputValue})`
}
function makeGrey() {
    let greyTone = getRandom(0, 255);
    return `rgb(${greyTone},${greyTone},${greyTone})`
}

function getRandomBoolean() {
    let index = getRandom(0,10  );
    if (index == 1) {
        return true;
    } return false;
}

function makeDiamond(x, y, strokeColor) {
    width = gridWidth;
    height = gridHeight;
    x = x_start + x * width;
    y = y_start + y * height;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const points = `0,${height / 2} ${width / 2},0 ${width},${height / 2} ${width / 2},${height}`;

    const diamond = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    diamond.setAttribute("points", points);
    diamond.setAttribute("transform", `translate(${x}, ${y})`);
    diamond.setAttribute("fill", "none");
    diamond.setAttribute("stroke", strokeColor);
    diamond.setAttribute("stroke-width", "1");

    return diamond;
}

//drawing a house
function drawBlock(x, y, height, color) {
    // Fixed dimensions
    x = x_start + x * gridWidth + gridWidth / 2;
    y = y_start + y * gridHeight;
    const width = 10;
    const rightdepth = 5;
    const leftdepth = 5;


    const svgGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

    let leftFace = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    let rightFace = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    let topFace = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

    let r = color[0];
    let g = color[1];
    let b = color[2];


    //right face
    let x1 = x;
    let y1 = y;
    let x2 = x1 + width;
    let y2 = y1 - rightdepth;
    let x3 = x2;
    let y3 = y2 - height;
    let x4 = x1;
    let y4 = y3 + rightdepth;

    let rightFaceColor = makeRGB(r - 50, g - 50, b - 50);

    rightFace.setAttribute("points", `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`);
    rightFace.setAttribute("fill", rightFaceColor);
    svgGroup.appendChild(rightFace);


    //left face
    x1 = x;
    y1 = y;
    x2 = x1 - width;
    y2 = y1 - leftdepth;
    x3 = x2;
    y3 = y2 - height;
    x4 = x1;
    y4 = y3 + leftdepth;

    let leftFaceColor = makeRGB(r - 100, g - 100, b - 100);

    leftFace.setAttribute("points", `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`);
    leftFace.setAttribute("fill", leftFaceColor);
    svgGroup.appendChild(leftFace);

    //top
    x1 = x;
    y1 = y - height;
    x2 = x1 + width;
    y2 = y1 - rightdepth;
    x3 = x1;
    y3 = y2 - leftdepth;
    x4 = x1 - width;
    y4 = y3 + rightdepth;

    let topColor = makeRGB(r, g, b);

    topFace.setAttribute("points", `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`);
    topFace.setAttribute("fill", topColor);
    svgGroup.appendChild(topFace);

    return svgGroup;
}

function colorPicker(max){
    let index = getRandom(0,max);
    let color;
    if(index == 0){
        color = colors.blue;
    }else if(index == 1){
        color = colors.green;
    }else if(index == 2){
        color = colors.grey;
    }else if(index == 3){
        color = colors.purple;
    }else if(index == 4){
        color = colors.red;
    }else if(index == 5){
        color = colors.yellow;
    }
    return color;

}