let creatureX;
let creatureY = 0;

let creatureXSpeed = 3;
let creatureYSpeed = 4;

let blinkingTime = 0;
let blinking = false;

let x = 200;
let y = 0;

let x1 = -1;
let y1 = 400;
let y1Speed = -8;
let t = 0;

function setup() {
  let canvas=createCanvas(800, 500);
  canvas.parent("p5-canvas-container")
  creatureX = width / 2;
}

function draw() {
  background(232, 124, 23);

  // court lines
  stroke(255);
  line(width / 2, 0, width / 2, height);
  line(30, 220, 770, 220);
  line(30, 0, 30, height);
  line(770, 0, 770, height);

  // background ball 1
  y = sin(frameCount * 0.25) * 50;
  fill(202, 237, 26);
  strokeWeight(1);
  circle(x, y + 100, 25);

  // net
  let rectSize = 10;
  for (let yy = 120; yy <= 220; yy += rectSize) {
    for (let xx = 30; xx <= 770; xx += rectSize) {
      noFill();
      rect(xx, yy, rectSize, rectSize);
    }
  }

  fill(0);
  rect(10, 110, 20, 130);
  rect(770, 110, 20, 130);

  // tennis racket
  push();
  translate(mouseX, mouseY);

  stroke(0);
  fill(255);
  rect(-260, -8, 100, 26);

  stroke(255, 194, 194);
  strokeWeight(17);
  noFill();
  ellipse(0, 0, 180, 100);

  arc(-130, 35, 80, 50, PI + HALF_PI, -0.3);
  arc(-130, -30, 80, 50, 0.3, HALF_PI);

  rect(-160, 0, 30, 10);

  // grid
  stroke(0);
  strokeWeight(1);
  line(-80, 0, 80, 0);
  line(-70, -20, 70, -20);
  line(-70, 20, 70, 20);

  line(-50, -30, -50, 30);
  line(-30, -40, -30, 40);
  line(-10, -40, -10, 40);
  line(10, -40, 10, 40);
  line(30, -40, 30, 40);
  line(50, -30, 50, 30);
  line(70, -20, 70, 20);

  pop();

  // background ball 2
  y1Speed += 0.4;
  x1 += map(noise(t), 0, 1, 1, 4);
  y1 += y1Speed;
  y1 += noise(t + 100) * 2;

  if (y1 > height - 20) {
    y1 = height - 20;
    y1Speed = -map(noise(t), 0, 1, 6, 12);
  }

  t += 0.02;
  fill(202, 237, 26);
  circle(x1, y1, 25);

  // movements
  creatureX += creatureXSpeed;
  creatureY += creatureYSpeed;

  // from x
  if (creatureX <= 30 || creatureX >= 770) {
    creatureXSpeed *= -1;
  }

  // from top
  if (creatureY <= 0) {
    creatureYSpeed = abs(creatureYSpeed);
  }

  // distance from the center of the racket
  let distance = dist(creatureX, creatureY, mouseX, mouseY);

  if (distance <= 70) {
    // jump up
    creatureYSpeed = -abs(creatureYSpeed);

    // changing of x from the hit
    let offset = creatureX - mouseX;
    creatureXSpeed = offset * 0.15;
  }

  // restart
  if (creatureY > height) {
    creatureY = 0;
    creatureX = random(100, 700);
  }

  drawCreature(creatureX, creatureY);
}

// CREATURE

function drawCreature(x, y) {
  push();
  translate(x, y);

  drawBody();
  drawEyes();
  drawMouth();
  drawArm(-25, 0, -1);
  drawArm(25, 0, 1);
  drawLeg(-10, 30, -1);
  drawLeg(10, 30, 1);

  pop();
}

function drawBody() {
  noStroke();
  fill("rgb(226,253,16)");
  circle(0, 0, 60);

  fill("rgba(252,157,172,0.75)");
  circle(-15, -3, 17);
  circle(15, -3, 17);
}

function drawEyes() {
  blinkingTime++;

  if (blinkingTime > 120) blinking = true;
  if (blinkingTime > 130) {
    blinking = false;
    blinkingTime = 0;
  }

  if (blinking) {
    stroke(0);
    strokeWeight(3);
    line(-16, -7, -4, -7);
    line(4, -7, 16, -7);
  } else {
    noStroke();
    fill(0);
    circle(-10, -7, 12);
    circle(10, -7, 12);

    fill(255);
    circle(-10, -9, 6);
    circle(10, -9, 6);
  }
}

function drawMouth() {
  stroke(0);
  strokeWeight(4);
  noFill();
  arc(0, 5, 15, 10, 0.2 * PI, PI);
}

function drawArm(x, y, side) {
  push();
  translate(x, y);

  let wave = sin(frameCount * 0.1) * 6 * side;

  stroke(0);
  strokeWeight(4);
  noFill();

  beginShape();
  curveVertex(0, 0);
  curveVertex(0, 0);
  curveVertex(10 * side, 5 + wave);
  curveVertex(18 * side, 10 - wave);
  curveVertex(18 * side, 10 - wave);
  endShape();

  pop();
}

function drawLeg(x, y, side) {
  push();
  translate(x, y);

  let wave = sin(frameCount * 0.1) * 4 * side;

  stroke(0);
  strokeWeight(4);
  noFill();

  beginShape();
  curveVertex(0, 0);
  curveVertex(0, 0);
  curveVertex(4 * side + wave, 8);
  curveVertex(3 * side - wave, 14);
  curveVertex(3 * side - wave, 14);
  endShape();

  pop();
}