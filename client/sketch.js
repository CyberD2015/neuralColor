var socket = io();
var color1 = document.getElementById('color1');
var color2 = document.getElementById('color2');
var alertText1 = document.getElementById('alertText1');
var alertText2 = document.getElementById('alertText2');
var randColor = [255, 255, 255];
var generatedColor = [255, 255, 255];
var counter = 0;
newColors();

function trainingObject(r1, g1, b1, r2, g2, b2) {
    this.input = [r1, g1, b1];
    this.output = [r2, g2, b2];
}

function addData(r1, g1, b1, r2, g2, b2) {
    var temp = new trainingObject(r1 / 255, g1 / 255, b1 / 255, r2 / 255, g2 / 255, b2 / 255);
    socket.emit("addData", temp);
}

function requestData(r1, g1, b1) {
    socket.emit("requestData", [r1 / 255, g1 / 255, b1 / 255]);
}

function requestTrain() {
    socket.emit("trainNetwork", true);
}
socket.on("responseData", function (args) {
    for (var i = 0; i < 3; i++) args[i] = Math.round(args[i] * 255);
    generatedColor = args;
    color2.style.backgroundColor = generateRGBstring(args);
});
socket.on("conMade", function (idk) {});

function newColors() {
    randColor = newRandomColor();
    color1.style.backgroundColor = generateRGBstring(randColor);
    requestData(randColor[0], randColor[1], randColor[2]);
}

function rand255() {
    var rand = Math.floor(Math.random() * 256);
    return rand;
}

function generateRGBstring(c) {
    return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
}

function newRandomColor() {
    var c = [255, 255, 255];
    for (var i = 0; i < 3; i++) c[i] = rand255();
    return c;
}

function notaMatch() {
    newColors();
}

function match() {
    addData(randColor[0], randColor[1], randColor[2], generatedColor[0], generatedColor[1], generatedColor[2]);
    newColors();
}

function showCopyDialog(a) {
    if (a) text = color2.style.backgroundColor;
    else text = color1.style.backgroundColor;
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

function showText1() {
    alertText1.style.color = color2.style.backgroundColor;
    alertText1.innerHTML = "copy";
}

function showText2() {
    alertText2.style.color = color1.style.backgroundColor;
    alertText2.innerHTML = "copy";
}

function hideText() {
    alertText1.innerHTML = "";
    alertText2.innerHTML = "";
}