let scanned = [];
let sun;
let flower;


let curSun = 0;
let curFlower = 0;
let flowerY = 500;
 let flowerSpeedY = 0;


function preload() {
  for (let i = 1; i <= 3; i++) {
    scanned.push(loadImage("scantome/123-" + i + ".jpg"));
  }
}

function setup() {
  createCanvas(800, 500);

  eraseBg(scanned, 10);
  sun = crop(scanned, 0, 0, 585, 356);
  flower = crop(scanned, 0, 800, 650, 800);
  
}

function draw() {
  background(255);

  // examples: eye

  image(
    sun[curSun],
    mouseX,
    mouseY,
    sun[0].width * 0.25,
    sun[0].height * 0.25
  );

  curSun = floor((frameCount / 20) % sun.length);

  // rocket

  push();
  translate(width / 2, flowerY);
  rotate(radians(0));
  imageMode(CENTER);
  image(
    flower[curFlower],
    0,
    0,
    flower[0].width * 0.25,
    flower[0].height * 0.25
  );
  pop();


  curFlower = floor((frameCount / 10) % 3);

  flowerY += flowerSpeedY;
  flowerSpeedY += -0.01;
  if (flowerY < -100) {
    flowerY = 500;
    flowerSpeedY = 0;
  }


 }

// You shouldn't need to modify these helper functions:

function crop(imgs, x, y, w, h) {
  let cropped = [];
  for (let i = 0; i < imgs.length; i++) {
    cropped.push(imgs[i].get(x, y, w, h));
  }
  return cropped;
}

function eraseBg(imgs, threshold = 10) {
  for (let i = 0; i < imgs.length; i++) {
    let img = imgs[i];
    img.loadPixels();
    for (let j = 0; j < img.pixels.length; j += 4) {
      let d = 255 - img.pixels[j];
      d += 255 - img.pixels[j + 1];
      d += 255 - img.pixels[j + 2];
      if (d < threshold) {
        img.pixels[j + 3] = 0;
      }
    }
    img.updatePixels();
  }
  // this function uses the pixels array
  // we will cover this later in the semester - stay tuned
}
