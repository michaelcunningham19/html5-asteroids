var Spaceship = function (stage, assetManager) {
    'use strict';
    
    // variable declaration
    var sprite, spriteHeight, spriteWidth, isDestroyed, myScope, eventShipDestroyed, eventShipVelocityChange, maxVelocity, velocity, accelerant, position, rotationSpeed, isMoving, keyDirection, xSpeed, ySpeed, whichGunFiredLast, timeSinceLastShot, fireRate, shipThrustersPlaying;
    
    // variable initialization
    sprite            = assetManager.getSprite('assets');
    spriteHeight      = sprite.getBounds().height;
    spriteWidth       = sprite.getBounds().width;
    maxVelocity       = 1;
    velocity          = [0, 0];
    position          = [280, 300];
    accelerant        = 0.25;
    isMoving          = false;
    isDestroyed       = false;
    keyDirection      = 2;
    rotationSpeed     = 10;
    xSpeed            = 0;
    ySpeed            = 0;
    whichGunFiredLast = 0;  // 0 = left, 1 = right
    timeSinceLastShot = 0;
    fireRate          = 400;
    
    // to keep track of scope
    myScope = this;

    // construct custom event objects
    eventShipDestroyed      = new createjs.Event('onShipDestroyed', true);
    eventShipVelocityChange = new createjs.Event('onShipVelocityChange', true);

    // add spaceship to stage
    stage.addChild(sprite);

    // ---------------------------------------------- get/set methods
    this.isDestroyed = function () {
        return isDestroyed;
    };

    this.getSprite = function () {
        return sprite;
    };

    this.setKeyDirection = function (value) {
        keyDirection = value;
    };

    // ----------------------------------------------- event handlers
    function onDestroyed(e) {
        
        // cleanup
        sprite.stop();
        sprite.removeEventListener('animationend', onDestroyed);
        
        // dispatch event that the ship has been killed!
        sprite.dispatchEvent(eventShipDestroyed);
    }
    
    function onVelocityChange(e) {
        
        sprite.scaleX = 1;

        // up arrow
        if (keyDirection === 3) {
            
            xSpeed = velocity[0] + accelerant * Math.sin(sprite.rotation * Math.PI / 180);
            ySpeed = velocity[1] - accelerant * Math.cos(sprite.rotation * Math.PI / 180);
            
            velocity = [xSpeed, ySpeed];

            // throttle up the engines
            if (shipThrustersPlaying) {
                
                createjs.Sound.play('shipThruster', '', 0, -1, .5, 0, null, null);
                
                sprite.gotoAndPlay('spaceshipMoving');
                sprite.addEventListener('animationend', function () {
                    sprite.stop();
                    createjs.Sound.stop('shipThruster');
                    shipThrustersPlaying = false;
                });
            }

        }
        
        position = [position[0] + xSpeed, position[1] + ySpeed];
        sprite.x = position[0];
        sprite.y = position[1];

        if (position[0] < 0) {
            position[0] = position[0] + canvas.width;   
        }
        
        if (position[0] > canvas.width) {
            position[0] = 0;   
        }
        
        if (position[1] < 0) {
            position[1] = position[1] + canvas.height;   
        }
        
        if (position[1] > canvas.height) {
            position[1] = 0;   
        }
        
    }
    
    // ---------------------------------------------- public methods
    this.getClip = function () {
        return sprite;   
    }
    
    this.accelerate = function (keyPressed) {
        
        this.setKeyDirection(keyPressed);
        
        if (!isMoving) {
            
            // setup listener to listen for ticker to control animation
            shipThrustersPlaying = true;
            createjs.Ticker.addEventListener('tick', onVelocityChange);
        
            isMoving = true;
            
        }
    };
    
    this.fire = function () {
        
        var projectile, now;
        
        projectile = new Projectile(sprite, stage, assetManager);
        now        = Date.now();
        
        if (now - timeSinceLastShot < fireRate) {
            return;
        }
        
        if (whichGunFiredLast === 0) {
            
            projectile.spawn(8, -25);
            whichGunFiredLast = 1;
            
        } else {
            
            projectile.spawn(-30, -25);
            whichGunFiredLast = 0;
            
        }
        
        timeSinceLastShot = now;
        
        projectiles.push(projectile);
        
    };
    
    this.rotate = function (keyPressed) {
        
        this.setKeyDirection(keyPressed);
        
        sprite.gotoAndStop('spaceshipIdle');
        sprite.scaleX = 1;
     
        if (keyDirection === 1) {
            
            // rotating left
            sprite.rotation -= rotationSpeed;

        } else if (keyDirection === 2) {
            
            // rotating right
            sprite.rotation += rotationSpeed;
            
        }
    };

    this.reset = function () {
        
        var halfWidth, halfHeight;
        
        halfWidth  = (spriteWidth / 2);
        halfHeight = (spriteHeight / 2);
        
        sprite.gotoAndStop('spaceshipIdle');
        
        if (!isDestroyed) {
            sprite.x = 280;
            sprite.y = 300;
        }
        
        sprite.regX = halfWidth;
        sprite.regY = halfHeight;
        
        xSpeed      = 0;
        ySpeed      = 0;
        velocity    = [0, 0];
        isDestroyed = false;
        
        createjs.Ticker.addEventListener('tick', onVelocityChange);
        
    };

    this.destroy = function () {
        
        if (!isDestroyed) {
            
            isDestroyed = true;

            sprite.stop();
            
            // remove listener to stop animation
            createjs.Ticker.removeEventListener('tick', onVelocityChange);
            isMoving = false;
            
            sprite.gotoAndPlay('spaceshipDestroyed');
            sprite.addEventListener('animationend', onDestroyed);
        }
        
    };
};