function setup() {
 let canvas = createCanvas(600, 600);
 canvas.parent("p5-canvas-container")
}

function draw() {
  background(220);
  circle(mouseX, mouseY,50)
}