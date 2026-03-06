let creatureX;
let creatureY = 0;

let creatureXSpeed = 3;
let creatureYSpeed = 4;

let velX = 3;
let velY = 0;
let accY = 0.02;

let blinkingTime = 0;
let blinking = false;

let x = 200;
let y = 0;

let x1 = -1;
let y1 = 400;
let y1Speed = -8;
let t = 0;

// stars
let starX = 0;
let starY = 0;
let starTimer = 0;

function setup() {
  let canvas = createCanvas(800, 500);
canvas.parent("p5-canvas-container");

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

  // background ball
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

  // distance
  let distance = dist(creatureX, creatureY, mouseX, mouseY);

  // racket rotation
  let racketAngle = 0;
  if (distance > 150) {
    racketAngle = -PI / 2;
  }

  // racket
  push();
  translate(mouseX, mouseY);
  rotate(racketAngle);

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

  // second background ball
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

  // physics
  velY += accY;
  creatureX += velX;
  creatureY += velY;

  if (creatureX <= 30 || creatureX >= 770) {
    velX *= -1;
  }

  if (creatureY <= 0) {
    velY = abs(velY);
  }

  // hit racket
  if (distance <= 70) {

    velY = -abs(velY);

    let offset = creatureX - mouseX;
    velX = offset * 0.15;

    starX = creatureX;
    starY = creatureY;
    starTimer = 20;
  }

  if (creatureY > height) {
    creatureY = 0;
    creatureX = random(100, 700);
  }

  drawCreature(creatureX, creatureY);

  // draw stars
  if (starTimer > 0) {

    fill(255,255,0);
    noStroke();

    circle(starX + 15, starY, 6);
    circle(starX - 15, starY, 6);
    circle(starX, starY - 15, 6);
    circle(starX, starY + 15, 6);

    starTimer--;
  }
}

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

  let distance = dist(creatureX, creatureY, mouseX, mouseY);

  stroke(0);
  strokeWeight(4);
  noFill();

  if (distance > 150) {
    arc(0, 15, 15, 10, PI, TWO_PI);
  } else {
    arc(0, 5, 15, 10, 0.2 * PI, PI);
  }
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