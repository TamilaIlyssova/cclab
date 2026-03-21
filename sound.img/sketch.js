let backtrack;
let img;
let x =[]
let y =[]
let sounds=[]

function preload(){
  backtrack = loadSound("my-sounds/00.mp3");
  for (let i = 1; i <= 8; i++){
    sounds.push(loadSound("my-sounds/0" + i + ".mp3"))
  }
  img = loadImage("images/asterisk.png")
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);
 
}

function draw() {
  background(220);
  for (let i =0; i<x.length; i++) {
 drawCircle(x[i], y[i],)
  }
}

function drawCircle(x,y){
fill(0)
//circle(x, y, 30)
tint(0, 0, 255)
image(img, x, y);
filter(BLUR,4)
}


function mousePressed(){
  x.push(mouseX)
  y.push(mouseY)
  //let index = (x.length -1)% sounds.length
  sounds[index].play()
  console.log(sounds.length)
  console.log(index)
}