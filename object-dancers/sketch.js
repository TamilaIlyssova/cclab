/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new TamilaDancer(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class TamilaDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    // add properties for your dancer here:
    
  this.tailAngle = 0;
  this.bodyY = 0;
  this.bodyX = 0;
  this.bodyRotate = 0;
    
  
  }
  update() {
    // update properties here to achieve
    // your dancer's desired moves and behaviour

   // tail moves like a sine wave
    this.tailAngle = sin(frameCount * 0.15) * 0.8;
    // whole body moves up and down slightly
    this.bodyY = sin(frameCount * 0.1) * 3;
    // body sways left and right
    this.bodyX = sin(frameCount * 0.08) * 5;
    // body rotates slightly
    this.bodyRotate = sin(frameCount * 0.2) * 0.2;
  }
  display() {
    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.
    push();
    translate(this.x + this.bodyX, this.y + this.bodyY);

    
    
    // ******** //
    // ⬇️ draw your dancer from here ⬇️
    
    stroke(242, 115, 5);
    strokeWeight(1.5);
    noFill();
    
    
     // tail
     push();
     translate(0, -50); 
     rotate(this.tailAngle * 0.3);
     beginShape();
     stroke(245, 148, 64);
     strokeWeight(16);
     noFill();
     for (let y = 0; y <= 50; y += 4) {
     let x = sin(y * 0.12 + frameCount * 0.1) * 4; 
     vertex(x, -y);
     }
     endShape();
     pop();
    
    // body
    push();
    rotate(this.bodyRotate);
    fill(245, 148, 64);
    stroke(156, 74, 3);
    ellipse(0, 0, 75, 100);
    pop();

     // arms
    fill(245, 141, 51);
    stroke(156, 74, 3);
    ellipse(-40, 72, 37, 22);
    ellipse(40, 72, 37, 22);
    
    // head
    fill(245, 148, 64);
    ellipse(0, 55, 86, 70);
    
    // ears
    fill(245, 141, 51);
    triangle(-40, 37, -30, 0, -12, 20);
    triangle(40, 37, 30, 0, 12, 20);

    fill(250, 197, 240);
    triangle(-30, 25, -28, 8, -19, 18);
    triangle(30, 25, 28, 8, 19, 18);
    

    // cheeks
    stroke(247, 139, 204)
    fill(250, 197, 240);
    ellipse(-30, 55, 15, 10);
    ellipse(30, 55, 15, 10);
    
    // eyes
    stroke(156, 74, 3);
    fill(255);
    ellipse(-20, 50, 20, 17);
    ellipse(20, 50, 20, 17);
    
    // pupils
    fill(0);
    noStroke()
    ellipse(-20, 50, 13, 17);
    ellipse(20, 50, 13, 17);
    
    // nose
    stroke(128, 10, 81)
    strokeWeight(0.6);
    fill(222, 82, 143);
    triangle(-5, 60, 0, 65, 5, 60);
    
    // mouse
    noFill();
    stroke(54, 3, 33);
    strokeWeight(2)
    arc(0, 65, 20, 12, 0, PI/2);
    


    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too, 
    // is a part if your Dancer object.
    // comment it out or delete it eventually.
    //this.drawReferenceShapes()

    pop();
  }
  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }
}



/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/