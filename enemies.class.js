









import { player1 } from "./player.class.js";
import {c, gameBar } from "./view.js";

// Enemy shoots array
export const enemyShoots = [];
export const enemies = [];

// Enemies entity
class Enemies {
    constructor(name, sw, sh, x, y, w, h){
        this.name = name;
        this.sx = 0;
        this.sy = 0;
        this.sw = sw;
        this.sh = sh;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.image = new Image();
        this.image.src = `images/${name}.png`;
    }
    render() {
        c.drawImage(this.image,this.sx, this.sy, this.sw, this.sh, this.x,this.y,this.w,this.h);
    }
}

class NoShootingEnemy extends Enemies{
    constructor(name, sw, sh, x, y, w, h){
        super(name, sw, sh, x, y, w, h);
        this.verticalDirection = randomNumber(2, -1);
        this.speed = randomNumber(10,5);
        this.life = 0;
        this.pointsForDestroy = 10;
        // Interval to change enemy vertical direction
        setInterval(() => {
            this.verticalDirection = randomNumber(2, -1);
        },randomNumber(4000,1000));
    }
    render (){
        this.x -= this.speed;
        this.y += (2 * this.verticalDirection);
        if (this.verticalDirection > 0) {this.sy = 45.9;}
        else if (this.verticalDirection < 0) {this.sy = 89.1;}
        else {this.sy = 0;}

        super.render();
        // Animation
        this.sx += 70.85;
        if(this.sx > 708.5) this.sx = 0;
    } 
}

class ShootingEnemy extends Enemies{
    constructor(name, sw, sh, x, y, w, h){
        super(name, sw, sh, x, y, w, h);
        this.aimPosition = player1.y;
        this.hasShooted = false;
        this.life = 10;
        this.pointsForDestroy = 50;
        
        setInterval(() => {
            this.aimPosition = player1.y;
        }, 4000);

        this.sxIncrease = 1;
    }
    render(){
        if (this.sx < 720) this.sxIncrease = 1;
        if (this.sx > 12960) this.sxIncrease = -1;
        this.sx += 720 * this.sxIncrease;
        console.log(this.sx);
        super.render();
        if (this.aimPosition < this.y && this.y - this.aimPosition > 5) this.y -= 5;
        else if (this.aimPosition < this.y && this.y - this.aimPosition < 5) this.y -= 1;
        else if (this.aimPosition > this.y && this.aimPosition - this.y > 5) this.y += 5;
        else if (this.aimPosition > this.y && this.aimPosition - this.y > 5) this.y += 1;
        else {this.y += 0; this.shoot()};
    }
    shoot(){
        if(!this.hasShooted) {
            this.hasShooted = true; 
            enemyShoots.push(new EnemyShoots(this));
        }
    }
}

// Enemies shoots
class EnemyShoots {
    constructor(enemy){
        this.shootBy = enemy.name;
        this.x = enemy.x + 5;
        this.y = enemy.y + (enemy.h / 2 - 5);
        this.w = 30;
        this.h = 15;
        this.image = new Image();   
        this.image.src = "images/bullets.png";
    }
    render (){
        c.drawImage(this.image,this.x,this.y,this.w,this.h);
        this.x -= 10 ;
    }
}

// Enemies explosions
export class Explosion {
    constructor(x,y){
        this.x = x;
        this.y = y - 30; ;
        this.w = 105;
        this.h = 105;
        this.image = new Image();
        this.image.src = "images/explosion.png";
    }
    render (){
        c.drawImage(this.image,this.x,this.y,this.w,this.h)
    }
}

export function enemiesRelease(){

    // fishWarrior is released by amount of them
    if(enemies.filter(element => element.name === 'fishWarrior').length < 6) {
        enemies.push(new NoShootingEnemy('fishWarrior', 70.85, 45.85, innerWidth + 20, randomNumber(innerHeight - 100, 100),125,75));
    }
        // angryShark has released by some conditions, ONLY one realese every 200 points
    if ((gameBar.points) % 200 === 0 && gameBar.points > 0 && (enemies.filter(element => element.name === 'angryShark') < 1)) {
        enemies.push(new ShootingEnemy('angryShark', 720, 330, innerWidth - 270, innerHeight + 75, 250, 125));
    }
}

// Mathematical and random function
function randomNumber(max, min){
    return Math.floor(Math.random() * (max - min)) + min;
}