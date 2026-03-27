let myBall
let myball2



function setup() {
  createCanvas(400, 400);
  myBall = new Ball(100, 200)
  myBall2 = new Ball(300, 200)

}

function draw() {
  background(220);
  myBall.move()
  myBall.display()
  myBall2.move()
  myBall2.display()
}


class Ball {
  constructor(startX, startY){
    this.x = startX
    this.y = startY
    this.dia = 50 
  }
  move(){
    
    this.y += sin(frameCount * 0.1) 
  }

  display(){
    circle(this.x, this.y, this.dia)  
  }
}
