let bgSound, rainSound, nightSound, bloomSound, birdSound, deathSound;

function preload() {
  bgSound = loadSound("sounds/bg.mp3");
  rainSound = loadSound("sounds/rain.mp3");
  nightSound = loadSound("sounds/night.mp3");
  bloomSound = loadSound("sounds/bloom.mp3");
  birdSound = loadSound("sounds/bird.mp3");
  deathSound = loadSound("sounds/death.mp3");
}

let sunClicks = 0;
let waterClicks = 0;
let groundClicks = 0;

let crownSize = 30;    
let trunkHeight = 15;  

let weather = "sunny";
let weatherTimer = 0;

let sunX = 120;
let moonX = -80;
let transitioning = false;
let transitDir = 0;

let isDead = false;
let gameOver = false;
let deathTimer = 0;
let blooming = false;
let bloomTimer = 0;
let deathSoundPlayed = false;
let currentBg = "day";

let nudge = "sun";
let nudgeDone = 0;
let hint = "Tap the Sun ☀️ to help the tree grow taller!";

let drops = [];
let birds = [];
let flowers = [];
let particles = [];
let starsX = [];
let starsY = [];

function setup() {
  createCanvas(600, 600);
 
for (let i = 0; i < 30; i++) {
  starsX.push(random(600));
  starsY.push(random(200));
}

  for (let i = 0; i < 80; i++) {
    drops.push(new RainDrop(random(width), random(height)));
  }
  for (let i = 0; i < 9; i++) {
    flowers.push(new Flower(50 + i * 60));
  }

  bgSound.setLoop(true);
  bgSound.play();
}

function draw() {
  if (gameOver) {
    drawGameOver();
    return;
  }

  weatherTimer++;
  if (weatherTimer > 360) {
    let prev = weather;
    let r = floor(random(3));
    if (r === 0) {
      weather = "sunny"
    } else if  (r === 1) {
     weather = "rainy"
    } else {
      weather = "night"
    };

    if (weather !== prev) {
      if (weather === "night" && prev !== "night") {
        transitioning = true;
        transitDir = 1;
      } if (prev === "night" && weather !== "night") {
        transitioning = true;
        transitDir = -1;
      }
      if (weather === "rainy") {
        bgSound.stop(); 
        nightSound.stop();
        rainSound.setLoop(true); 
        rainSound.play();
        currentBg = "rain";
      } if (weather === "night") {
        bgSound.stop(); 
        rainSound.stop();
        nightSound.setLoop(true); 
        nightSound.play();
        currentBg = "night";
      } else {
        rainSound.stop(); 
        nightSound.stop();
        bgSound.setLoop(true); 
        bgSound.play();
        currentBg = "day";
      }
    }
  weatherTimer = 0;
  }

  if (transitioning) {
    if (transitDir === 1) {
      sunX -= 3;
      moonX += 3;
      if (moonX >= 120) { 
        moonX = 120; 
        sunX = -80; 
        transitioning = false; 
      }
    } else {
      moonX -= 3;
      sunX += 3;
      if (sunX >= 120) { 
        sunX = 120; 
        moonX = -80; 
        transitioning = false;
       }
    }
  }

  let bounceY = sin(frameCount * 0.05) * 3;

  if (weather === "sunny") {
    background(185, 215, 235);
  } else if (weather === "rainy") {
    background(100, 140, 180);
  } else {
    background(30, 40, 70);
  }

  // stars
  if (weather === "night") {
  noStroke();
  for (let i = 0; i < 30; i++) {
    let tw = sin(frameCount * 0.05 + i) * 0.5 + 0.5;
    fill(255, 255, 255, (0.4 + tw * 0.5) * 255);
    ellipse(starsX[i], starsY[i], 2.4);
  }
}

  // rain
  if (weather === "rainy") {
    for (let i = 0; i < drops.length; i++) {
      drops[i].update();
      drops[i].display();
    }
  }

  // sun
  if (sunX > -70) {
    push();
    translate(sunX, 120 + bounceY);
    stroke(255, 210, 40, 165); 
    strokeWeight(3);
    for (let i = 0; i < 8; i++) {
      let a = i / 8 * TWO_PI + frameCount * 0.01;
      line(cos(a)*58, sin(a)*58, cos(a)*72, sin(a)*72);
    }
    noStroke(); 
    fill(255, 184, 28);
    ellipse(0, 0, 120, 120);
    pop();
    drawCuteFace(sunX, 120 + bounceY, false, false, 1);
  }

  // moon
  if (moonX > -70) {
    noStroke();
    fill(200, 200, 220);
    ellipse(moonX, 120 + bounceY, 100, 100);
    fill(176, 184, 216);
    ellipse(moonX + 10, 112 + bounceY, 66, 66);
    drawCuteFace(moonX, 120 + bounceY, true, false, 1);
  }

  // cloud
  push();
  translate(480, 120 + bounceY * -1);
  if (weather === "rainy"){ 
    fill(170, 189, 206);
  } else {
    fill(255);
  }
  noStroke();
  ellipse(0,0,120, 80);
  ellipse(-40,10,80, 60);
  ellipse(40,10,80, 60);
  ellipse(0,-30,90,70);
  drawCuteFace(0, 0, false, false, 1);
  pop();

  // ground
  if (isDead) {
  fill(107, 74, 42);
} else {
  fill(143, 93, 72);
}
  noStroke();
 ellipse(300, 650, 800, 400);

  // grass
  for (let i = 0; i < 20; i++) {
    let gx = 15 + i * 29;
    let gy = groundY(gx)+170;
    let sw = sin(frameCount * 0.03 + i) * 0.2;
    if (isDead) {
  stroke(90, 58, 32);
} else {
  stroke(74, 170, 40);
}
    strokeWeight(2);
    line(gx, gy, gx + sin(sw) * 8, gy - 14);
  }

  // flowers
  for (let i = 0; i < flowers.length; i++) {
    flowers[i].display(isDead);
  }

  // tree or dead tree
  if (isDead === false) {
    drawTree(bounceY);
  } else {
    drawDeadTree();
    if (deathSoundPlayed === false) {
      deathSoundPlayed = true;
      bgSound.stop(); 
      rainSound.stop(); 
      nightSound.stop();
      deathSound.play();
    }
    deathTimer++;
    if (deathTimer > 180){
      gameOver = true;
    }
  }

  // birds
  for (let i = birds.length - 1; i >= 0; i--) {
    birds[i].update();
    birds[i].display();
    if (birds[i].isDone) {
      birds.splice(i, 1);
    }
  }

  if (blooming) {
    bloomTimer--;
    if (frameCount % 90 === 0 && birds.length < 4) {
      birds.push(new Bird());
      birdSound.play();
    }
    if (bloomTimer <= 0){ 
      blooming = false;
    }
  }

  // particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDone){
      particles.splice(i, 1);
    }
  }

  // hint bar
  noStroke();
  fill(0, 0, 0, 148);
  rect(15, height - 38, width - 30, 28, 8);
  fill(255);
  textSize(14); 
  textAlign(CENTER); 
  textStyle(NORMAL); 
  noStroke();
  text(hint, 300, height - 18);
}

// tree
function drawTree(bounceY) {
  let isSick = false;
  let treeColor = color(92, 184, 92);

  if (sunClicks > 2) {
  let t = (sunClicks - 2) / 3;
  treeColor = lerpColor(color(92, 184, 92), color(210, 185, 40), t);
  isSick = true;
}
if (waterClicks > 2) {
  let t = (waterClicks - 2) / 3;
  treeColor = lerpColor(color(92, 184, 92), color(100, 70, 30), t);
  isSick = true;
}
if (groundClicks > 2) {
  let t = (groundClicks - 2) / 3;
  treeColor = lerpColor(color(92, 184, 92), color(80, 110, 35), t);
  isSick = true;
}
  let trunkBaseY = groundY(300)+50;
  let trunkTopY = trunkBaseY-(trunkHeight + 20);

  // trunk
  noStroke(); 
  fill(112, 56, 22);
  rect(285, trunkTopY, 30, trunkHeight + 20, 3);

  // tiny sprout just face, no crown yet
  if (crownSize < 20) {
    let s = map(crownSize, 0, 20, 0.2, 0.4);
    drawCuteFace(300, trunkTopY - 5, false, false, s);
    return;
  }

  let tY = trunkTopY + 8 + bounceY;
  let cW = crownSize;
  let cH = crownSize * 0.85;

  fill(treeColor);
  ellipse(300,tY,cW,cH * 0.85);
  ellipse(300 - cW*0.35, tY + 12,cW * 0.6, cH * 0.6);
  ellipse(300 + cW*0.35, tY + 12,cW * 0.6, cH * 0.6);
  ellipse(300,tY - cH*0.28, cW * 0.7, cH * 0.65);

  // apples
  if (sunClicks <= 2 && waterClicks <= 2 && groundClicks >= 3 && crownSize > 100 && !blooming) {
    fill(230, 40, 40);
    ellipse(300-30, tY-20, 20); 
    ellipse(300+40, tY-10, 20);
    ellipse(300+10, tY-50, 20); 
    ellipse(300-45, tY+20, 20);
    ellipse(300+35, tY+30, 20);
  }

  // bloom flowers
  if (blooming) {
  colorMode(HSB);
  for (let i = 0; i < 8; i++) {
    let fa = i / 8.0 * TWO_PI;
    fill(i * 45, 80, 90); 
    noStroke();
    ellipse(300 + cos(fa)*cW*0.3, tY + sin(fa)*cH*0.25, 14);
    fill(60, 100, 100);
    ellipse(300 + cos(fa)*cW*0.3, tY + sin(fa)*cH*0.25, 6);
  }
  colorMode(RGB);
  fill(255, 220, 0);
  stroke(0);
  strokeWeight(3);
  textSize(16);
  textAlign(CENTER);
  textStyle(BOLD);
  text("The tree is blooming! 🌸", 300, 50);
  noStroke();
}
  // face that grows with tree
  let s = map(crownSize, 20, 200, 0.4, 1.0);
  drawCuteFace(300, tY, isSick, false, s);
}

function drawDeadTree() {
  let trunkBaseY = groundY(300) - 5;
  let trunkTopY = trunkBaseY - (trunkHeight + 20);
  stroke(90, 58, 16); 
  strokeWeight(16); 
  strokeCap(ROUND);
  line(300, trunkBaseY, 300, trunkTopY);
  strokeWeight(8);
  line(300, trunkTopY+20, 250, trunkTopY-10);
  line(300, trunkTopY+30, 335, trunkTopY);
  drawCuteFace(300, trunkTopY - 10, false, true, 1);
}

// face
function drawCuteFace(x, y, sleepy, dead, s) {
  noStroke();
  if (dead) {
    stroke(0); 
    strokeWeight(2.5 * s); 
    strokeCap(ROUND);
    line(x-18*s, y-8*s, x-10*s, y);
    line(x-10*s, y-8*s, x-18*s, y);
    line(x+10*s, y-8*s, x+18*s, y);
    line(x+18*s, y-8*s, x+10*s, y);
    line(x-6*s, y+12*s, x+8*s, y+7*s);
    noStroke();
  } else if (sleepy) {
    stroke(0); 
    strokeWeight(4 * s);
    line(x-20*s, y-5*s, x-8*s,  y-5*s);
    line(x+8*s, y-5*s, x+20*s, y-5*s);
    noStroke(); 
    noFill();
    stroke(0);
    strokeWeight(3 * s);
    arc(x, y+10*s, 10*s, 5*s, PI, 0);
    noStroke();
  } else {
    fill(0);
    ellipse(x-15*s, y-5*s, 16*s, 20*s);
    ellipse(x+15*s, y-5*s, 16*s, 20*s);
    fill(255);
    ellipse(x-18*s, y-9*s, 6*s, 8*s);
    ellipse(x+12*s, y-9*s, 6*s, 8*s);
    ellipse(x-13*s, y-2*s, 3*s, 3*s);
    ellipse(x+17*s, y-2*s, 3*s, 3*s);
    noFill();
    stroke(0); 
    strokeWeight(3 * s);
    arc(x, y+10*s, 12*s, 12*s, 0, PI);
    noStroke();
  }
}

// classes

class RainDrop {
  constructor(x, y) {
    this.x = x; 
    this.y = y;
    this.speed = random(7, 13);
    this.len = random(12, 25);
    this.op = random(0.35, 0.75);
  }
  update() {
    this.y += this.speed; 
    this.x -= 1.5;
    if (this.y > height) {
      this.y = -10; 
      this.x = random(width); 
    }
    if (this.x < 0){ 
      this.x = width; 
      this.y = random(height); 
    }
  }
  display() {
    stroke(150, 200, 255, this.op * 255); 
    strokeWeight(1.2);
    line(this.x, this.y, this.x - this.len*0.2, this.y + this.len);
    noStroke();
  }
}

class Flower {
  constructor(x) {
    this.x = x + random(-10, 10);
    this.y = groundY(this.x) - random(-150, -155);
    this.r = random(5, 9);
    this.hue = random(360);
  }
  display(dead) {
    colorMode(HSB);
    if (dead) {
      fill(20, 60, 30); 
      noStroke(); 
      ellipse(this.x, this.y, 6);
    } else {
      for (let a = 0; a < 5; a++) {
        let fa = a / 5.0 * TWO_PI;
        fill(this.hue, 80, 90); 
        noStroke();
        ellipse(this.x + cos(fa)*this.r, this.y + sin(fa)*this.r*0.7, this.r*1.6);
      }
      fill(60, 100, 100); 
      ellipse(this.x, this.y, this.r);
    }
    colorMode(RGB);
  }
}

class Bird {
  constructor() {
    this.x = -30; 
    this.y = random(70, 180);
    this.speed = random(1.5, 3);
    this.phase = random(TWO_PI);
    this.isDone = false;
  }
  update() {
    this.x += this.speed;
    this.y += sin(frameCount * 0.08 + this.phase) * 0.5;
    if (this.x > width + 40){
      this.isDone = true;
    }
  }
  display() {
    let flap = sin(frameCount * 0.3 + this.phase) * 4;
    stroke(68); 
    strokeWeight(2); 
    strokeCap(ROUND); 
    noFill();
    push();
    translate(this.x, this.y);
    beginShape(); 
    vertex(0,0); 
    quadraticVertex(-8, flap-6, -16, 0) 
    endShape();
    beginShape(); 
    vertex(0,0); 
    quadraticVertex( 8, flap-6,  16, 0); 
    endShape();
    noStroke(); 
    fill(68); 
    ellipse(0, 0, 4);
    pop();
  }
}

class Particle {
  constructor(x, y, r, g, b) {
    this.x = x; 
    this.y = y;
    this.vx = random(-3, 3);
    this.vy = random(-4, -1);
    this.r = r; 
    this.g = g; 
    this.b = b;
    this.size = random(4, 10);
    this.alpha = 255;
    this.isDone = false;
  }
  update() {
    this.x += this.vx; 
    this.y += this.vy;
    this.vy += 0.15; 
    this.alpha -= 6;
    if (this.alpha <= 0){ 
      this.isDone = true;
    }
  }
  display() {
    noStroke(); 
    fill(this.r, this.g, this.b, this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}

// helpers

function groundY(x) {
  let dx = (x - 300) / 420;
  if (dx > 1){ 
    return height;
  }
  if (dx < -1){
    return height;
  }
  return 570 - 160 * sqrt(1 - dx * dx);
}

function spawnParticles(x, y, r, g, b) {
  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(x, y, r, g, b));
  }
}

function drawGameOver() {
  background(26, 15, 8);
  noStroke(); 
  fill(107, 74, 42);
  ellipse(300, 580, 800, 400);
  stroke(74, 42, 8); 
  strokeWeight(14); 
  strokeCap(ROUND);
  line(300, 480, 300, 330);
  strokeWeight(7);
  line(300, 350, 250, 318); 
  line(300, 365, 338, 332);
  drawCuteFace(300, 315, false, true, 1);
  fill(232, 68, 42); 
  stroke(0); 
  strokeWeight(4);
  textSize(46); 
  textAlign(CENTER); 
  textStyle(BOLD);
  text("GAME OVER", 300, 248);
  fill(204, 153, 102); 
  textSize(18); 
  strokeWeight(2);
  text("Your tree has died...", 300, 292);
  fill(255, 255, 255, 180); 
  textSize(14);
  text("Click anywhere to try again", 300, 335);
  noStroke();
}

// nudges

function nextNudge() {
  if (nudge === "sun") {       
    nudge = "water";
  } 
  else if (nudge === "water") {
    nudge = "ground";
  } 
  else {
    nudge = "sun";
  }
  nudgeDone = 0;
  updateHint();
}

function updateHint() {
  if (nudge === "sun") {       
    hint = "Tap the Sun ☀️ once!";
  } 
  else if (nudge === "water") {
    hint = "Good! Now tap the Cloud ☁️ once!";
  } 
  else {
    hint = "Great! Now tap the Ground 🌱 once!";
  }
}

function checkBloom() {
  if (sunClicks <= 2 && waterClicks <= 2 && groundClicks <= 2 && trunkHeight >= 80 && crownSize >= 100 && !blooming) {
    blooming = true;
    bloomTimer = 500;
    bloomSound.play();
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        spawnParticles(random(100,500), random(80,200), random(255), random(255), random(255));
      }, i * 180);
    }
    hint = "🌸 Perfect Balance! The tree is blooming! Birds are coming!";
  }
}

function currentNudgeText() {
  let left = 3 - nudgeDone;
  if (nudge === "sun"){   
    return "tap Sun ☀️ " + left + "x";
  }
  if (nudge === "water") {
    return "tap Cloud ☁️ " + left + "x";
  }
  return "tap Ground 🌱 " + left + "x";
}

// mouse

function mousePressed() {
  if (gameOver) { 
    resetGame(); 
    return; 
  }
  if (isDead) {
    return;
  }

  let dSun = dist(mouseX, mouseY, sunX, 120);
  let dCloud = dist(mouseX, mouseY, 480, 120);
  let onGround = mouseY > groundY(mouseX) - 20;

  if (dSun < 60) {
    spawnParticles(sunX, 120, 255, 220, 50);
    sunClicks++;
    if (waterClicks > 0) {
      waterClicks--;
    }
    if (sunClicks <= 2) {
      trunkHeight = trunkHeight + 15;
    if (trunkHeight > 180) {
      trunkHeight = 180;
      }
      if (nudge === "sun") { 
        sunClicks = 0;
        nudgeDone++; 
        if (nudgeDone >= 1) {
          nextNudge();
        } else {
          updateHint();
        }
      } else {
        hint = "Try to follow the order: Sun ☀️  → Cloud ☁️  → Ground 🌱";
      }
    } else if (sunClicks < 6) {
      hint = "Careful! Too much sun is drying it out...";
    } else { 
      isDead = true; 
    }
    checkBloom();

  } else if (dCloud < 60) {
    spawnParticles(480, 120, 80, 160, 255);
    waterClicks++;
    if (sunClicks > 0) {
      sunClicks--;
    }
    if (waterClicks <= 2) {
      crownSize = crownSize + 20;
    if (crownSize > 200) {
      crownSize = 200;
      }
      if (nudge === "water") {
        waterClicks = 0;
        nudgeDone++; 
        if (nudgeDone >= 1) {
          nextNudge(); 
        } else {
          updateHint(); 
        }
      } else {
        hint = "Try to follow the order: Sun ☀️  → Cloud ☁️  → Ground 🌱";
      }
    } else if (waterClicks < 6) {
      hint = "Careful! Too much water is drowning the roots...";
    } else { 
      isDead = true; 
    }
    checkBloom();

  } else if (onGround) {
    spawnParticles(mouseX, mouseY, 120, 80, 40);
    groundClicks++;
    if (sunClicks > 0) {
      sunClicks--;
    }
    if (waterClicks > 0) {
      waterClicks--;
    }
    if (groundClicks <= 2) {
      crownSize = crownSize + 15;
      if (crownSize > 200) {
        crownSize = 200;
      }
      if (nudge === "ground") { 
        groundClicks = 0;
        nudgeDone++; 
        if (nudgeDone >= 1) {
          nextNudge(); 
        } else {
          updateHint(); 
        }
      } else {
        hint = "Try to follow the order: Sun ☀️ → Cloud ☁️  → Ground 🌱";
      }
    } else if (groundClicks < 6) {
      hint = "Careful! Too much fertilizer is rotting the roots...";
    } else { 
      isDead = true; 
    }
    checkBloom();
  }

  if (sunClicks > 8) {
  sunClicks = 8;
}
if (sunClicks < 0) {
  sunClicks = 0;
}

if (waterClicks > 8) {
  waterClicks = 8;
}
if (waterClicks < 0) {
  waterClicks = 0;
}

if (groundClicks > 8) {
  groundClicks = 8;
}
if (groundClicks < 0) {
  groundClicks = 0;
}
}

function resetGame() {
  sunClicks = 0; 
  waterClicks = 0; 
  groundClicks = 0;
  crownSize = 30;
  trunkHeight = 15;
  weather = "sunny"; 
  weatherTimer = 0;
  sunX = 120; 
  moonX = -80;
  transitioning = false; 
  transitDir = 0;
  isDead = false; 
  gameOver = false; 
  deathTimer = 0;
  blooming = false;
  bloomTimer = 0; 
  deathSoundPlayed = false;
  birds = []; 
  particles = [];
  nudge = "sun"; 
  nudgeDone = 0;
  hint = "Tap the Sun ☀️ to help the tree grow taller!";
  rainSound.stop();
  nightSound.stop();
  bgSound.setLoop(true);
  bgSound.play();
  currentBg = "day";
}