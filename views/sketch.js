const clearButton = document.querySelector(".sketch-clear");

let lines = [];
let penColor;
let bgColor;
let penWidth;

function createSketch() {
  createCanvas(window.innerWidth * 0.64, window.innerHeight).parent(
    document.querySelector(".sketch-container")
  );

  background("#1e1e1e");
}
window.addEventListener("resize", createSketch);
function setup() {
  createSketch();
  socket.on("mouse", newDrawing);
}
function newDrawing(lineData) {
  const lineIncoming = new MyLine(lineData.penColor, lineData.penWidth);
  lineIncoming.px = lineData.px;
  lineIncoming.py = lineData.py;
  lineIncoming.x = lineData.x;
  lineIncoming.y = lineData.y;

  lines.push(lineIncoming);
}

function mouseDragged() {
  let line = new MyLine("#ffffff", "4");
  lines.push(line);
  socket.emit("mouse", line);
}

function draw() {
  for (let line of lines) {
    line.show();
  }
}

clearButton.addEventListener("click", clearCanvas);
socket.on("clearSketch", clear);
function clearCanvas() {
  socket.emit("clearCanvas");
}
function clear() {
  lines = [];
  background("#1e1e1e");
  console.log("clear");
}
