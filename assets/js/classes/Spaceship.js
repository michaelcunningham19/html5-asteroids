var Spaceship = function (stage, assetManager) {
    
    // variable initialization
    var sprite            = assetManager.getSprite('assets');
    var maxVelocity       = 1;
    var velocity          = [0, 0];
    var position          = [stage.canvas.width, 0];
    var accelerant        = 0.1;
    var isDestroyed       = false;
    var xSpeed            = 0;
    var ySpeed            = 0;
    var whichGunFiredLast = 0;  // 0 = left, 1 = right
    var timeSinceLastShot = 0;
    var fireRate          = 500;
    var keyPressed        = 0;
    
    // add spaceship to stage
    stage.addChild(sprite);

    // ---------------------------------------------- get/set methods
    this.isDestroyed = function () {
        return isDestroyed;
    };

    this.getSprite = function () {
        return sprite;
    };

    // ----------------------------------------------- event handlers
    function onVelocityChange() {
        
        sprite.scaleX = 1;

        // up arrow
        if (keyPressed === 3) {
            
            xSpeed = velocity[0] + accelerant * Math.sin(sprite.rotation * Math.PI / 180);
            ySpeed = velocity[1] - accelerant * Math.cos(sprite.rotation * Math.PI / 180);
            
            velocity = [xSpeed, ySpeed];

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
        
        //console.log('spaceship x: ' + sprite.x);
        //console.log('spaceship y: ' + sprite.y);
        
    }
    
    // ---------------------------------------------- public methods
    this.getClip = function () {
        return sprite;   
    }
    
    this.accelerate = function (key) {
        keyPressed = key;
        createjs.Ticker.addEventListener('tick', onVelocityChange);
    };
    
    this.fire = function () {
        
        var now        = Date.now();
        var projectile = new Projectile(sprite, stage, assetManager, projectileID);
        
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
        projectileID++;
        
    };
    
    this.rotate = function (key) {
        
        sprite.gotoAndStop('spaceshipIdle');
        sprite.scaleX = 1;
     
        if (key === 1) {
            
            // rotating left
            sprite.rotation -= 10;

        } else if (key === 2) {
            
            // rotating right
            sprite.rotation += 10;
            
        }
    };

    this.reset = function () {
        
        sprite.gotoAndStop('spaceshipIdle');

        sprite.regX = sprite.getBounds().width / 2;
        sprite.regY = sprite.getBounds().height / 2;
        
        xSpeed      = 0;
        ySpeed      = 0;
        position    = [canvas.width / 2, canvas.height / 2];
        velocity    = [0, 0];
        isDestroyed = false;
        
        if (isRestart) {
            stage.addChild(sprite);   
        }
        
        createjs.Ticker.addEventListener('tick', onVelocityChange);
        
    };

    this.destroy = function () {

        isDestroyed = true;

        sprite.stop();

        // remove listener to stop animation
        createjs.Ticker.removeEventListener('tick', onVelocityChange);

        sprite.gotoAndPlay('spaceshipDestroyed');
        sprite.addEventListener('animationend', function () {

            // cleanup
            sprite.stop();
            sprite.removeEventListener('animationend', this);

            stage.removeChild(sprite);
            sprite.x = -999;
            sprite.y = -999;
            
            onGameOver();

        });
        
    };
};
