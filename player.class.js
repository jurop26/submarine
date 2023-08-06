import { canvasContext } from "./view.js";

class Player {
    constructor(x, y){
        this.sx = 0;
        this.sy = 0;
        this.sw = 756.3;
        this.sh = 340.8;
        this.x = x;
        this.y = y;
        this.w = 200;
        this.h = 100;
        this.image = new Image();
        this.image.src = "images/submarine.png";
        this.interval;
    }
    render()  {
        if (this.sx == 0 && this.sy == 0){
            canvasContext.drawImage(this.image, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w,this.h);
            this.sx = 770;
        }
        else if (this.sx == 0 && this.sy == 344.4) {
            canvasContext.drawImage(this.image, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w,this.h); 
        }
        else {
            canvasContext.drawImage(this.image, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w,this.h);
            this.sx = 0; 
        }
    } 

    // Player animation
    animation(direction) {
        
        clearInterval(this.interval); //clear unfinished interval
        this.interval = setInterval(()=> { 
            if(direction == "up" && this.y > 70) {this.y -= 1}
            if(direction == "down" && this.y < innerHeight - this.h - 50) {this.y += 1;} 
            if(direction == "right" && this.x < innerWidth - this.w - 30) {this.x += 1}
            if(direction == "left" && this.x > 30) {this.x -= 1}

            if(direction == "upleft" && this.y > 70 && this.x > 30) {this.y -= 1; this.x -= 1}
            if(direction == "upright" && this.y > 70 && this.x < innerWidth - this.w - 30) {this.y -= 1; this.x += 1}
            if(direction == "downleft" && this.y < innerHeight - this.h - 50 && this.x > 30) {this.y += 1; this.x -= 1}
            if(direction == "downright" && this.y < innerHeight - this.h - 100 && this.x < innerWidth - this.w - 30) {this.y += 1; this.x += 1}
            },1);
    }

    // Clear animation process when keyup 
    intervalStop(){
        clearInterval(this.interval);
    }
    death () {
        console.log('You are death')
    }
}

export class Shoot {
    constructor(){
        this.x = player1.x + 190;
        this.y = player1.y + 64;
        this.w = 30;
        this.h = 15;
        this.image = new Image();   
        this.image.src = "images/bullets.png";     
    }
    render (){
        canvasContext.drawImage(this.image,this.x,this.y,this.w,this.h);
        this.x += 10 ;
    }
}

export class ItemsForCollection {
    constructor(name = "String",image = "String"){
        this.name = name;
        this.x = innerWidth + 50;
        this.y = randomNumber((innerHeight - 200), 100);
        this.w = 30;
        this.h = 40;
        this.image = new Image();
        this.image.src = image;
    }
    render (){
        canvasContext.drawImage(this.image,this.x,this.y,this.w,this.h);
        this.x -= 3;
    }
}

export const player1 = new Player(100, innerHeight - 500);

export function randomNumber(max, min){
    return Math.floor(Math.random() * (max - min)) + min;
}