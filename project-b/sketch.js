let waterClicks = 0;
let sunClicks = 0;
let groundClicks = 0;
let weather = "sunny"; // "sunny", "rainy", "night"
let weatherTimer = 0;

let bounceY = 0;

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("p5-canvas-container");
  
}

function draw() {
  // weather change 
  weatherTimer++;
  if (weatherTimer > 360) { // every 6 seconds (at 60 fps)
    let rand = floor(random(3));
    if (rand === 0) weather = "sunny";
    else if (rand === 1) weather = "rainy";
    else weather = "night";
    weatherTimer = 0;
  }

  // background
  if (weather === "sunny") background(185, 215, 235); 
  else if (weather === "rainy") background(100, 140, 180); 
  else background(30, 40, 70); 

  // light breathing/bouncing animation
  bounceY = sin(frameCount * 0.05) * 3;

  //  ground
  fill(143, 93, 72);
  noStroke();
  ellipse(300, 650, 800, 400);

  // sun
  if (weather !== "night") {
    fill(255, 184, 28); 
    ellipse(120, 120 + bounceY, 120, 120);
    drawCuteFace(120, 120 + bounceY);
  } else {
    fill(200, 200, 220); 
    ellipse(120, 120 + bounceY, 100, 100);
    drawCuteFace(120, 120 + bounceY, true); 
  }

  // cloud
  push();
  translate(480, 120 + bounceY * -1); // Moves in opposite phase
  fill(255);
  if (weather === "rainy") fill(180, 200, 220);
  noStroke();
  ellipse(0, 0, 120, 80);
  ellipse(-40, 10, 80, 60);
  ellipse(40, 10, 80, 60);
  ellipse(0, -30, 90, 70);
  
  if (weather === "rainy") {
    // Raindrops
    stroke(50, 150, 255);
    strokeWeight(3);
    for(let i = 0; i < 5; i++) {
      let rx = random(-50, 50);
      let ry = random(40, 100) + (frameCount % 20) * 5;
      line(rx, ry, rx, ry + 10);
    }
    noStroke();
  }
  drawCuteFace(0, 0);
  pop();

  // tree
  // Tree state 
  let treeColor = color(104, 217, 48); // Normal green
  let isSick = false;

  if (waterClicks >= 5) {
    treeColor = color(220, 220, 80); // Yellow (overwatered)
    isSick = true;
  }
  if (sunClicks >= 5) {
    treeColor = color(160, 110, 50); // Brown (burned)
    isSick = true;
  }

  // Trunk
  fill(112, 56, 22);
  rect(285, 350, 30, 120);

  // Crown 
  let growthBase = min(groundClicks * 15, 60); // Grows up to a certain limit
  let crownSize = 130 + growthBase;

  push();
  translate(300, 330 + bounceY);
  fill(treeColor);
  
  ellipse(0, 0, crownSize, crownSize - 20);
  ellipse(-crownSize*0.35, 15, crownSize*0.6, crownSize*0.6);
  ellipse(crownSize*0.35, 15, crownSize*0.6, crownSize*0.6);
  ellipse(0, -crownSize*0.3, crownSize*0.7, crownSize*0.7);

  // Tree face
  drawCuteFace(0, 0, isSick);

  // If fertilized a lot (ground > 4) and tree is not sick 
  if (groundClicks >= 4 && !isSick) {
    fill(230, 40, 40); // Red apples
    ellipse(-30, -20, 20);
    ellipse(40, -10, 20);
    ellipse(10, -50, 20);
    ellipse(-45, 20, 20);
    ellipse(35, 30, 20);
  }
  pop();

  // hints and instructions
  fill(255);
  textSize(20);
  textAlign(CENTER);
  textStyle(BOLD);
  
  // Black outline for text 
  stroke(0);
  strokeWeight(3);
  
  if (waterClicks >= 5) {
    text("Too wet! 🌧️ Click the Sun to dry!", 300, 40);
  } else if (sunClicks >= 5) {
    text("Tree is drying! ☀️ Click the Cloud to water it!", 300, 40);
  } else if (weather === "sunny") {
    text("It's hot! Click the Cloud (💧 Soft) to water the tree.", 300, 40);
  } else if (weather === "rainy") {
    text("It's raining! Click the Sun (☀️ Tall) to give some light.", 300, 40);
  } else if (weather === "night") {
    text("Nighttime. Click the Ground (🌱 Wide) to fertilize the soil.", 300, 40);
  }
  noStroke();
}

// Helper function to draw cute faces
function drawCuteFace(x, y, isSleepyOrSick = false) {
  fill(0);
  
  if (isSleepyOrSick) {
    // Closed or sad eyes
    stroke(0);
    strokeWeight(4);
    line(x - 20, y - 5, x - 8, y - 5);
    line(x + 8, y - 5, x + 20, y - 5);
    noStroke();
    
    // Sad/Neutral mouth
    noFill();
    stroke(0);
    strokeWeight(3);
    arc(x, y + 10, 10, 5, PI, 0);
    noStroke();
  } else {
    // Normal cute eyes
    ellipse(x - 15, y - 5, 16, 20);
    ellipse(x + 15, y - 5, 16, 20);
    
    // Eye highlights
    fill(255);
    ellipse(x - 18, y - 9, 6, 8);
    ellipse(x + 12, y - 9, 6, 8);
    ellipse(x - 13, y - 2, 3, 3);
    ellipse(x + 17, y - 2, 3, 3);
    
    // Smile
    noFill();
    stroke(0);
    strokeWeight(3);
    arc(x, y + 10, 12, 12, 0, PI);
    noStroke();
  }
}

// click interactions
function mousePressed() {
  // Calculate distance from mouse to objects
  let dSun = dist(mouseX, mouseY, 120, 120);
  let dCloud = dist(mouseX, mouseY, 480, 120);

  // Sun click (Tall)
  if (dSun < 60) {
    sunClicks++;
    if (waterClicks > 0) 
      waterClicks--; // Sun evaporates excess water
  }
  // Cloud click (Soft)
  else if (dCloud < 60) {
    waterClicks++;
    if (sunClicks > 0) 
      sunClicks--; // Water cools down from overheating
  }
  // Ground click (Wide)
  else if (mouseY > 450) {
    groundClicks++;
  }
  
  // Constraints so counters don't go to infinity
  //cloud
  if (waterClicks > 8) {
    waterClicks = 8;
  }
  if (waterClicks < 0) {
    waterClicks = 0;
  }

  // sun
  if (sunClicks > 8) {
    sunClicks = 8;
  }
  if (sunClicks < 0) {
    sunClicks = 0;
  }

  // ground
  if (groundClicks > 10) {
    groundClicks = 10;
  }
  if (groundClicks < 0) {
    groundClicks = 0;
  }
}