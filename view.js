
const canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style.position = "relative";
export const c = canvas.getContext("2d");

export class Background {	
    constructor(sourceImage){
        this.x = 0;
        this.y = 0;
        this.w = innerWidth;
        this.h = innerHeight;
        this.image = new Image();
        this.image.src = sourceImage;
    }

    render() {
        c.drawImage(this.image, this.x, this.y, this.w, this.h);
        c.drawImage(this.image, this.x + this.w, this.y, this.w, this.h)
        if (this.x <= (innerWidth * (-1))) this.x = 0; 
        else this.x -= 1;
    }
}

class GameBar {
    constructor(){
        this.x = 100;
        this.y = 30;
        this.w = 300;
        this.h = 30;
        this.points = 0;
        this.ammo = 50;
    }

    render() {
        // Life text
        c.font = "32px Arial Black";
        c.textAlign = 'start';
        c.strokeText("Life:", 20, 57);
        c.fillStyle = 'yellow';
        c.fillText("Life:", 20, 57);
        // life bar
        c.fillStyle = "green";
        c.fillRect(this.x, this.y, this.w, this.h);
        // Ammo text
        c.font = "32px Arial Black";
        c.strokeText("Ammo:", 420, 57);
        c.fillStyle = 'yellow';
        c.fillText("Ammo:", 420, 57);
        // Ammo
        c.font = "32px Arial Black";
        c.strokeText(this.ammo, 560, 57);
        // If ammo less then 15 change to red color
        if (this.ammo < 15 || this.ammo === 'NO AMMO') c.fillStyle = 'red';
        else c.fillStyle = 'yellow';
        c.fillText(this.ammo, 560, 57);
        // points
        c.font = "32px Arial black";
        c.textAlign = 'end';
        c.strokeText(this.points, innerWidth - 30, 57);
        c.fillStyle = 'yellow';
        c.fillText(this.points, innerWidth - 30, 57);
    }
}

export const background = new Background('images/background.png');
export const gameBar = new GameBar();