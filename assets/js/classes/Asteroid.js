var Asteroid = function (stage, assetManager, ship, id) {
    
    // initialization
    var shipSprite = ship.getSprite();
    var clip       = assetManager.getSprite('assets', 'asteroidAlive');
    var speed      = 2;
    var yDisplace  = -1;
    var xDisplace  = -1;

    // --------------------------------------------- private methods
    function random(low, high) {
        return Math.round(Math.random() * (high - low)) + low;
    }
    
    // ---------------------------------------------- public methods
    this.getClip = function () {
        return clip;
    };
    
    this.setup = function () {
        
        // random selection of speed of asteroid
        speed = random(1, 3);
        
        // asteroid starts on left or right of stage?
        if (random(1, 2) === 1) {
            
            // move right
            clip.x = -50;
            
            // randomly select starting y location of asteroid
            clip.y = random(50, stage.canvas.height);
            clip.rotation = random(45, -45);
            
        } else {
            
            // move left
            clip.x = stage.canvas.width + 50;
            clip.y = random(50, stage.canvas.height);
            clip.rotation = random(135, 225);
            
        }

        // fire startMe again to take the new rotation of the asteroid
        clip.gotoAndPlay('asteroidAlive');
            
        // convert current rotation of object to radians
        // calculating X and Y displacement
        xDisplace = Math.cos(clip.rotation * (Math.PI / 180)) * speed;
        yDisplace = Math.sin(clip.rotation * (Math.PI / 180)) * speed;
        clip.play();
        
        // fix the reg point
        clip.regX = clip.getBounds().width / 2;
        clip.regY = clip.getBounds().height / 2;
        
        // setup listener to listen for ticker to monitor collisions
        createjs.Ticker.addEventListener('tick', onCollisionTest);
		
        // add asteroids so they are below the ship
        stage.addChildAt(clip, stage.getChildIndex(shipSprite));

    };

    // ----------------------------------------------- event handlers
    function onCollisionTest(e) {
        
        // move sprite
        clip.x += xDisplace;
        clip.y += yDisplace;

        if (createjs.Ticker.getTicks() % 2 === 0) {
        
            if (clip.x < -75) {
                clip.x = clip.x + canvas.width + 150;
            }

            if (clip.x > canvas.width + 75) {
                clip.x = 0;
            }

            if (clip.y < -75) {
                clip.y = clip.y + canvas.height + 150;
            }

            if (clip.y > canvas.height + 75) {
                clip.y = 0;
            }

            //console.log('----tick');
            //console.log('# asteroids: ' + asteroids.length);
            //console.log('asteroid x: ' + clip.x);
            //console.log('asteroid y: ' + clip.y);

            clip.rotation += .5;

            // only do collision test on every other tick to save on processing
            var projectilesLength = projectiles.length;
            var x = 0;
            
            for (x = 0; x < projectilesLength; x++) {

                if (ndgmr.checkPixelCollision(clip, projectiles[x].getClip(), .01)) {
                    destroy(true);
                    projectiles[x].remove();
                }

            }

            if (ndgmr.checkPixelCollision(clip, shipSprite, .01)) {
                ship.destroy(true);
                destroy();
            }
            
            var asteroidsLength = asteroids.length;
            
            //for (x = 0; x < asteroidsLength; x++) {
                
            //    if (ndgmr.checkPixelCollision(clip, asteroids[x].getClip(), .01)) {
            //        destroy();
            //        asteroids[x].destroyMe();
            //    }
                
            //}
            
        }

    }
    
    this.destroyMe = function (bool) {
        destroy(bool);
    }

    function destroy(bool) {
        console.log(asteroids);
        console.log('destroyed! ' + id);
        createjs.Ticker.removeEventListener('tick', onCollisionTest);
        clip.stop();
        
        // play death sequence of asteroid
        if (bool) {
            createjs.Sound.play('asteroidExplosion');
        }
        clip.gotoAndPlay('asteroidDestroy');
        clip.addEventListener('animationend', function () {
            
            // cleanup event listeners
            clip.removeEventListener('animationend', this);

            // remove this asteroid object
            stage.removeChild(clip);
            asteroids.splice(asteroids.indexOf(id), 1);
            onAsteroidDestroyed();

        });
    }
};