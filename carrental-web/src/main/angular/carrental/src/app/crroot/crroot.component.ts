import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

let that: CrrootComponent;

@Component({
  selector: 'app-crroot',
  templateUrl: './crroot.component.html',
  styleUrls: ['./crroot.component.scss']
})
export class CrrootComponent implements OnInit {
  
  title = 'Please choose a link.';
  @ViewChild('myCanvas') canvas: ElementRef;
  ctx: CanvasRenderingContext2D;
  width: number; 
  height: number;
  ballArray = [];
  
  constructor() { }

  ngOnInit() {      
      that = this;
      this.ctx = this.canvas.nativeElement.getContext('2d');
      this.width = this.canvas.nativeElement.width;
      this.height = this.canvas.nativeElement.height;
      
      this.createBalls(10);      

      window.requestAnimationFrame(this.mainLoop);
  }

  createBalls(numberOfBalls) {
      let mywidth = this.width;
      let myheight = this.height;
      let myctx = this.ctx;
      for(let i=0; i < numberOfBalls; i++) {
        // Create a ball with random position and speed
        let ball =  new Ball(mywidth*Math.random(), myheight*Math.random(), (10*Math.random())-5, (10*Math.random())-5, 40, myctx); 
        // Add it to the array
        this.ballArray.push(ball);
      }              
    }  
      
  mainLoop() {
      // vasClear the can
      that.ctx.clearRect(0, 0, that.width, that.height);
      // For each ball in the array
      for(let i=0; i < that.ballArray.length; i++) {      
        let balls = that.ballArray[i];
        
        // 1) Move the ball
        balls.move();   
    
        // 2) collision test with walls
        that.collisionTestWithWalls(balls);
    
        // 3) draw the ball
        balls.draw();
    }
    
    that.collisionTestBetweenBalls();
    
    // Ask for new animation frame
    window.requestAnimationFrame(that.mainLoop);
  }
   
  collisionTestWithWalls(ball) {
      if (ball.x < ball.rayon) {
          ball.x = ball.rayon;
          ball.vx *= -1;
      } 
      if (ball.x > this.width - (ball.rayon)) {
          ball.x = this.width - (ball.rayon);
          ball.vx *= -1;
      }     
      if (ball.y < ball.rayon) {
          ball.y = ball.rayon;
          ball.vy *= -1;
      }     
      if (ball.y > this.height - (ball.rayon)) {
          ball.y = this.height - (ball.rayon);
          ball.vy *= -1;
      }
  }

  collisionTestBetweenBalls() {  
    let balls = this.ballArray;
    
    for (let i = 0; i < this.ballArray.length; i++) {
          for (let j = i + 1; j < this.ballArray.length; j++) {
              let dx = balls[j].x - balls[i].x;
              let dy = balls[j].y - balls[i].y;
            
              let dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < (balls[j].rayon + balls[i].rayon)) {
                  // balls have contact so push back...
                  let normalX = dx / dist;
                  let normalY = dy / dist;
                  let middleX = (balls[i].x + balls[j].x) / 2;
                  let middleY = (balls[i].y + balls[j].y) / 2;
                
                  balls[i].x = middleX - normalX * balls[i].rayon;
                  balls[i].y = middleY - normalY * balls[i].rayon;
                  balls[j].x = middleX + normalX * balls[j].rayon;
                  balls[j].y = middleY + normalY * balls[j].rayon;
                
                  let dVector = (balls[i].vx - balls[j].vx) * normalX;
                  dVector += (balls[i].vy - balls[j].vy) * normalY;
                  let dvx = dVector * normalX;
                  let dvy = dVector * normalY;
                
                  balls[i].vx -= dvx;
                  balls[i].vy -= dvy;
                  balls[j].vx += dvx;
                  balls[j].vy += dvy;
              }
          }
      }
  }
}

class Ball {        
    rayon = 0;
        
    constructor (public x: number, public y: number, public vx: number, public vy: number, diameter: number, private ctx: CanvasRenderingContext2D) {
        this.rayon = diameter/2;
    }
    
    draw() {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.rayon, 0, 2*Math.PI);
      this.ctx.fill();
    };
    
    move() {
      this.x += this.vx;
      this.y += this.vy;
    };
    
  }