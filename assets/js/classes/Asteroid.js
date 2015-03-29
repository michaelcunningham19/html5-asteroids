var Asteroid = function (stage, assetManager, ship, projectile) {
    'use strict';
    
    var speed, isMoving, yDisplace, xDisplace, shipSprite, clip, myScope, lengthProjectiles;
    
    // initialization
    shipSprite = ship.getSprite();
    
    // to keep track of scope
    myScope = this;

    // construct clip for this object and add to stage
    clip = assetManager.getSprite('assets', 'asteroidAlive');
    
    // initialize
    speed     = 2;
    isMoving  = false;
    yDisplace = xDisplace = -1;
    
    // --------------------------------------------- private methods
    function randomMe(low, high) {
        return Math.round(Math.random() * (high - low)) + low;
    }
    
    // ---------------------------------------------- public methods
    this.getClip = function () {
        return clip;
    };
    
    this.setupMe = function () {
        
        var dimensions, radians;
        
        // random selection of speed of asteroid
        speed = randomMe(1, 5);

        // get bounds of sprite so we can determine width / height
        dimensions = clip.getBounds();

        // asteroid starts on left or right of stage?
        if (randomMe(1, 2) === 1) {
            
            // move right
            clip.x = -50;
            
            // randomly select starting y location of asteroid
            clip.y = randomMe(50, stage.canvas.height);
            clip.rotation = randomMe(45, -45);
            
        } else {
            
            // move left
            clip.x = stage.canvas.width + 50;
            clip.y = randomMe(50, stage.canvas.height);
            clip.rotation = randomMe(135, 225);
            
        }

        // fire startMe again to take the new rotation of the asteroid
        clip.gotoAndPlay('asteroidAlive');
        
        if (!isMoving) {
            
            // convert current rotation of object to radians
            radians = clip.rotation * (Math.PI / 180);
            
            // calculating X and Y displacement
            xDisplace = Math.cos(radians) * speed;
            yDisplace = Math.sin(radians) * speed;
            clip.play();
            
            // setup listener to listen for ticker to control animation
            createjs.Ticker.addEventListener('tick', function () {
                
                // move sprite
                clip.x += xDisplace;
                clip.y += yDisplace;
                
                if (clip.x < -75) {
                    clip.x = clip.x + canvas.width;
                }

                if (clip.x > canvas.width + 75) {
                    clip.x = -75;
                }

                if (clip.y < -75) {
                    clip.y = clip.y + canvas.height - 100;
                }

                if (clip.y > canvas.height + 75) {
                    clip.y = -75;
                }
                
            });
            
            isMoving = true;
        }

        // setup listener to listen for ticker to monitor collisions
        createjs.Ticker.addEventListener('tick', onCollisionTest);
        
        // fix the reg point
        clip.regX = dimensions.width / 2;
        clip.regY = dimensions.height / 2;
		
        // add asteroids so they are below the ship
        stage.addChildAt(clip, stage.getChildIndex(shipSprite));

    };

    // ----------------------------------------------- event handlers
    function onCollisionTest(e) {
        
        var x, a, b, c;
        
        clip.rotation += 0.5;
        
        // only do collision test on every other tick to save on processing
        if ((createjs.Ticker.getTicks() % 2 === 0)) {
            
            lengthProjectiles = projectiles.length;
            
            for (x = 0; x < lengthProjectiles; x += 1) {
                
                if (ndgmr.checkPixelCollision(clip, projectiles[x].getClip(), 0.75)) {
                    
                    onKillMe();
                    onAsteroidDestroyed();
                    createjs.Ticker.removeEventListener('tick', onCollisionTest);
                    projectiles[x].remove();
                    
                }
                
            }
            
        } else {
            
            a = shipSprite.x - clip.x;
            b = shipSprite.y - clip.y;
            
            // Get distance with Pythagoras
            c = Math.sqrt((a * a) + (b * b));

            if (c <= 75) {
                
                // collision detection with the ship
                ship.destroy();
                
                // destroy this asteroid as well
                onKillMe();
                
            }
        }
    }

    function onKillMe() {
        
        createjs.Ticker.removeEventListener('tick', onCollisionTest);
        clip.stop();
        
        // play death sequence of asteroid
        clip.gotoAndPlay('asteroidDestroy');
        clip.addEventListener('animationend', function () {
            
            // cleanup event listeners
            clip.removeEventListener('animationend', this);

            // remove this asteroid object
            stage.removeChild(clip);
            
        });
        
    }
};