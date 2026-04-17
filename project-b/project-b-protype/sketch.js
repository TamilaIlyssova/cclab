let engine
let leaves = []
let angle=0
let offsetY = 0;
let blinking = false;

function setup() {
  createCanvas(600, 600);
  engine = new DecisionEngine();
}

function draw() {
  background(240);

  drawInterface();

  engine.update();
  let state = engine.getState()

  drawTree(state);
  angle = sin(frameCount * 0.04) * 0.08;
  offsetY = sin(frameCount * 0.08) * 5;
  // blinking
if (frameCount % 120 == 0) {
  blinking = true;
}

if (frameCount % 120 == 10) {
  blinking = false;
}
}


// interaction

function mousePressed() {
  if (mouseY < 100) {
    if (mouseX < width / 3) {
      engine.addChoice("soft");
    } else if (mouseX < 2 * width / 3) {
      engine.addChoice("tall");
    } else {
      engine.addChoice("wide");
    }
  }
}


// interface

function drawInterface() {
  fill(200);
  rect(0, 0, width / 3, 100);
  rect(width / 3, 0, width / 3, 100);
  rect(2 * width / 3, 0, width / 3, 100);

  fill(0);
  textAlign(CENTER, CENTER);
  text("💧 Soft", width / 6, 50);
  text("☀️ Tall", width / 2, 50);
  text("🌱 Wide", 5 * width / 6, 50);
}


// main class

class DecisionEngine {
  constructor() {
    this.choices = [];
    this.maxHistory = 10;

    this.softScore = 0;
    this.tallScore = 0;
    this.wideScore = 0;

    this.needsNewLeaves = true;
  }

  addChoice(type) {
    this.choices.push(type);

    if (this.choices.length > this.maxHistory) {
      this.choices.shift();
    }

    this.recalculate();
    this.needsNewLeaves = true;
  }

  recalculate() {
    this.softScore = 0;
    this.tallScore = 0;
    this.wideScore = 0;

    for (let i = 0; i < this.choices.length; i++) {
      let weight = i + 1;

      if (this.choices[i] === "soft") {
        this.softScore += weight;
      } else if (this.choices[i] === "tall") {
        this.tallScore += weight;
      } else if (this.choices[i] === "wide") {
        this.wideScore += weight;
      }
    }
  }

  update() {
    //prototype
  }

  getState() {
    let total = this.softScore + this.tallScore + this.wideScore;

    if (total == 0) {
      return {
        height: 100,
        width: 80,
        fluff: 1
      };
    }

    return {
      height: map(this.tallScore, 0, total, 100, 250),
      width: map(this.wideScore, 0, total, 80, 200),
      fluff: map(this.softScore, 0, total, 1, 3)
    };
  }
}

// tree

function drawTree(state) {
  push();
  translate(width / 2, height - 100+ offsetY);
  rotate(angle);

// trunk
  fill(120, 80, 50);
  rect(0, -state.height / 2, 14, state.height);

  // leaves
  if (leaves.length == 0 || engine.needsNewLeaves) {
    leaves = [];

    for (let i = 0; i < 60; i++) {
      leaves.push({
        x: random(-state.width / 3, state.width / 3),
        y: random(-state.height, -state.height / 2),
        size: random(40, 40)
      });
    }

    engine.needsNewLeaves = false;
  }


  noStroke()
  fill(50, 180, 80);
  for (let i = 0; i < leaves.length; i++) {
    ellipse(leaves[i].x, leaves[i].y, leaves[i].size);
  }


  // face

let eyeY = -state.height / 2-20

fill(255);

if (blinking) {
  stroke(0);
  line(-10, eyeY, -2, eyeY);
  line(2, eyeY, 10, eyeY);
} else {
  noStroke();
  ellipse(-6, eyeY, 12);
  ellipse(6, eyeY, 12);

  fill(0);
  ellipse(-6, eyeY, 5);
  ellipse(6, eyeY, 5);
}

// ротик
noFill();
stroke(0);
arc(0, eyeY + 15, 12, 8, 0, PI);
 
  pop();
}
