import { c, background, gameBar} from "./view.js";
import {player1, Shoot, ItemsForCollection} from "./player.class.js";
import {enemiesRelease, enemyShoots, enemies, Explosion} from "./enemies.class.js";

const playerShoots = [];
const explosions = []; 
const itemsForCollection = [];
const fps = 60;

let keys = [];
    keys['ArrowUp'] = false;
    keys['ArrowRight'] = false;
    keys['ArrowDown'] = false;
    keys['ArrowLeft'] = false;
    keys['Space'] = false;

// Preload
onload = () => {background.render();
gameBar.render(); 
player1.render(); setTimeout(() => update(), 3000)};

// Update and render, game loop
function update(){

    // Clear screen 
    c.clearRect(0,0,c.width, c.height);
    
    // Render objects
    background.render();
    gameBar.render(); 
    player1.render();
    hasCollisions();
    enemies.forEach((enemy) => enemy.render());
    explosions.forEach(explosion => explosion.render()); 
    playerShoots.forEach((shoot) => shoot.render());
    enemyShoots.forEach((shoot) => shoot.render());
    itemsForCollection.forEach((item) => item.render());
 
    if(gameBar.w > 0) enemiesRelease();

    setTimeout(() => requestAnimationFrame(update), 1000 / fps);
}

// Player control
addEventListener('keydown',(e) => {
    var x = e.code;
    keys[x] = e.type == "keydown";

    keyControl();
    e.preventDefault;}
,false)

addEventListener('keyup',(e) => {
    var x = e.code;
    keys[x] = e.type == "keydown";
    keyControl();
    e.preventDefault;}
,false)

function keyControl(){
    if(keys['ArrowUp'] === true && keys['ArrowRight'] === false && keys['ArrowLeft'] === false && keys['ArrowDown'] === false){player1.animation('up');}
    if(keys['ArrowUp'] === false && keys['ArrowRight'] === true && keys['ArrowLeft'] === false && keys['ArrowDown'] === false){player1.animation('right')}
    if(keys['ArrowUp'] === false && keys['ArrowRight'] === false && keys['ArrowLeft'] === false && keys['ArrowDown'] === true){player1.animation('down')}
    if(keys['ArrowUp'] === false && keys['ArrowRight'] === false && keys['ArrowLeft'] === true && keys['ArrowDown'] === false){player1.animation('left')}

    if(keys['ArrowUp'] === true && keys['ArrowRight'] === false && keys['ArrowLeft'] === true && keys['ArrowDown'] === false){player1.animation('upleft');}
    if(keys['ArrowUp'] === true && keys['ArrowRight'] === true && keys['ArrowLeft'] === false && keys['ArrowDown'] === false){player1.animation('upright');}
    if(keys['ArrowUp'] === false && keys['ArrowRight'] === false && keys['ArrowLeft'] === true && keys['ArrowDown'] === true){player1.animation('downleft');}
    if(keys['ArrowUp'] === false && keys['ArrowRight'] === true && keys['ArrowLeft'] === false && keys['ArrowDown'] === true){player1.animation('downright');}
    
    if(keys['Space'] === true){
        if (gameBar.ammo > 1) {
                player1.sx = 0; 
                player1.sy = 344.4; 
                player1.sw = 857; 
                player1.w = 227;
                playerShoots.push(new Shoot()); gameBar.ammo -= 1;
                setTimeout(() => {
                player1.sx = 770; 
                player1.sy = 0; 
                player1.sw = 759.8 ; 
                player1.w = 200;}, 60);
                }
        else gameBar.ammo = 'NO AMMO';
    }

    if(keys['ArrowUp'] === false && keys['ArrowRight'] === false && keys['ArrowLeft'] === false && keys['ArrowDown'] === false){player1.intervalStop()}
    if(keys['Space'] === false){
                player1.sx = 0;    
                player1.sy = 0; 
                player1.sw = 759.8; 
                player1.w = 200;}
}

// Collision among two objects
function collision(object1 = [] , object2 = []){
    return object2.findIndex((object) => {
        return object1.x <= object.x && object1.x + object1.w >= object.x && object1.y <= object.y && object1.y + object1.h >= object.y ||
		    object.x <= object1.x && object.x + object.w >= object1.x && object1.y <= object.y && object1.y + object1.h >= object.y ||
		    object.x <= object1.x && object.x + object.w >= object1.x && object.y <= object1.y && object.y + object.h >= object1.y ||
		    object1.x <= object.x && object1.x + object1.w >= object.x && object.y <= object1.y && object.y + object.h >= object1.y   
    }); 
};

// Player and shoots collision and render
function hasCollisions() {
       
    // player has collision, index return, -1 means no matches
    let hasCollision = collision(player1, enemies);
    if (hasCollision > -1){ 
        explosion(enemies[hasCollision].x, enemies[hasCollision].y);
        player1.y += 10; player1.x -= 10;
        // Life taken off Player bar
        if(gameBar.w <= 0) gameBar.w = 0;
        else gameBar.w -= 20;
        // Add points when collidated with enemy
        gameBar.points += enemies[hasCollision].pointsForDestroy;
        // Remove enemy after collision
        enemies.splice(hasCollision, 1);
        if (gameBar.w <= 0) {gameBar.w = 0; player1.death();}
    }

    // player collecting ammunition and health
    hasCollision = collision(player1, itemsForCollection);
    if (hasCollision > -1){ 
        // add ammunition for player
        if (itemsForCollection[hasCollision].name === 'ammo') 
            if(gameBar.ammo === "NO AMMO") gameBar.ammo = 30;
            else gameBar.ammo += 30;
        // add life for player
        if (itemsForCollection[hasCollision].name === 'life') (gameBar.w <= 270) ? gameBar.w += 30 : gameBar.w += 300 - gameBar.w;
        // remove item from array when collected
        itemsForCollection.splice(hasCollision, 1);
    }
    
    // Player shoots have collision, enemies array index return
    playerShoots.forEach(shoot => {
        const hasCollision = collision(shoot, enemies);  

        if(hasCollision > (-1)) {
            
            // Explosion x,y points of object which has the collision
            explosion(enemies[hasCollision].x, enemies[hasCollision].y);

            // Shoots and enemies remove from array after enemy got shot
            playerShoots.splice(shoot, 1);         
            
            // Check for enemy life, 0 means enemy's death
            if(enemies[hasCollision].life > 0) enemies[hasCollision].life -= 1;
            else {
                // Amount of points by enemy type
                gameBar.points += enemies[hasCollision].pointsForDestroy;
                enemies.splice(hasCollision, 1);
            }

            // Release ammo can every 10 hits
            if ((gameBar.points) % 150 === 0) itemsForCollection.push(new ItemsForCollection('ammo','images/ammo.png'));
            // Release heart can every 15 hits
            if ((gameBar.points) % 250 === 0) itemsForCollection.push(new ItemsForCollection('life','images/heart.jpeg'));
        } 
    });

    // Enemy shoots have collision, enemyShoots array index return
    enemyShoots.forEach((shoot) => {
        const hasCollision = collision(player1, enemyShoots);
        const shootedByEnemy = shoot.shootBy;

        if(hasCollision > (-1)) {
                enemyShoots.splice(shoot, 1);
                explosion(player1.x, player1.y);

                // Enemy's shoot set to false when hits a point
                let index = enemies.findIndex(element => element.name === shootedByEnemy);
                if(index > (-1)) enemies[index].hasShooted = false;
                // Life taken off Player bar
                gameBar.w -= 20;
                if (gameBar.w <= 0) {gameBar.w = 0; player1.death()}
        }

     }) 
        
        // Shoots remove from array after off screen
        let shootOffScreen = playerShoots.findIndex(shoot => shoot.x + 10 > innerWidth) 
        if (shootOffScreen > -1) playerShoots.splice(shootOffScreen, 1);
        
        // Enemies remove from array after off screen 
        let enemyOffScreen = enemies.findIndex(enemy => enemy.x < -100);
        if (enemyOffScreen > -1) enemies.splice(enemyOffScreen, 1);

        // Item for colletion remove from array after off screen
        let itemsForCollectionOffScreen = itemsForCollection.findIndex((item) => item.x < -30);
        if(itemsForCollection > -1) itemsForCollection.splice(itemsForCollectionOffScreen, 1);

        // Enemy shoots remove from array after off screen
        let enemyShootOffScreen = enemyShoots.findIndex(shoot => shoot.x - 10 < 0) 
        if (enemyShootOffScreen > -1) {enemyShoots.splice(shootOffScreen, 1);
            // Enemy's shoot set to false when off screen
            let index = enemies.findIndex(element => element.name === 'angryShark');
            if(index > (-1)) enemies[index].hasShooted = false; 
        }   
}    

// Explosion of enemies
function explosion(x, y) {
    explosions.push(new Explosion(x, y));
    explosions.forEach(() => {
                    setTimeout(() => {
                        explosions.splice(0, 1)
                    }, 200); 
                });            
}
