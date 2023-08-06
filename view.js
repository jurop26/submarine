const canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style.position = "relative";
export const canvasContext = canvas.getContext("2d");

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
        canvasContext.drawImage(this.image, this.x, this.y, this.w, this.h);
        canvasContext.drawImage(this.image, this.x + this.w, this.y, this.w, this.h)
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
        canvasContext.font = "32px Arial Black";
        canvasContext.textAlign = 'start';
        canvasContext.strokeText("Life:", 20, 57);
        canvasContext.fillStyle = 'yellow';
        canvasContext.fillText("Life:", 20, 57);
        // life bar
        canvasContext.fillStyle = "green";
        canvasContext.fillRect(this.x, this.y, this.w, this.h);
        // Ammo text
        canvasContext.font = "32px Arial Black";
        canvasContext.strokeText("Ammo:", 420, 57);
        canvasContext.fillStyle = 'yellow';
        canvasContext.fillText("Ammo:", 420, 57);
        // Ammo
        canvasContext.font = "32px Arial Black";
        canvasContext.strokeText(this.ammo, 560, 57);
        // If ammo less then 15 change to red color
        if (this.ammo < 15 || this.ammo === 'NO AMMO') canvasContext.fillStyle = 'red';
        else canvasContext.fillStyle = 'yellow';
        canvasContext.fillText(this.ammo, 560, 57);
        // points
        canvasContext.font = "32px Arial black";
        canvasContext.textAlign = 'end';
        canvasContext.strokeText(this.points, innerWidth - 30, 57);
        canvasContext.fillStyle = 'yellow';
        canvasContext.fillText(this.points, innerWidth - 30, 57);
    }
}

export const background = new Background('images/background.png');
export const gameBar = new GameBar();