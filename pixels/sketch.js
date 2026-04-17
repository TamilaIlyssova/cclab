let img;
let s=10

function preload() {
  img = loadImage("matisse.png")
}
function setup() {
  createCanvas(800,500);
}

function draw() {
  background(220);
  image(img, 0, 0)
  img. loadPixels()
  
  for (let y=0; y < img.height; y+=s){
    for(let x=0; x<=img.width; x+=s){
      let index=(x+y*img.width)*4
      let r=img.pixels[index]
      let g=img.pixels[index+1]
      let b=img.pixels[index+2]
      fill(r, g, b)
      rect(x, y, s, s)
    }
  }
  let index=(mouseX+mouseY*img.width)*4
  let r=img.pixels[index]
  let g=img.pixels[index+1]
  let b=img.pixels[index+2]
  fill(r, g, b)
  circle(mouseX, mouseY, 50)
  
  
  // fill(r, g, b)
  // circle(mouseX, mouseY, 50)
  
}
