var Projectile = function (ship, stage, assetManager, id) {
    
    var maxLifeSpan     = 75;
    var counter         = 0;
    var projectile      = assetManager.getSprite('assets', 'projectile');
    projectile.rotation = ship.rotation;
    
    // ---------------------------------------------- get/set methods
    this.getClip = function () {
        return projectile;
    };
    
    // ---------------------------------------------- private methods
    function move() { 
                
        if (counter === maxLifeSpan) {

            removeMe();
            
        } else {
            
            projectile.y = projectile.y - 20 * Math.cos(projectile.rotation * Math.PI / 180);
            projectile.x = projectile.x + 20 * Math.sin(projectile.rotation * Math.PI / 180);

            if (projectile.x < -75) {
                removeMe();
            }

            if (projectile.x > canvas.width + 75) {
                removeMe();
            }

            if (projectile.y < -75) {
                removeMe();
            }

            if (projectile.y > canvas.height + 75) {
                removeMe();
            }
            
            counter++;
            
        }
        
        console.log('-----tick');
        console.log('# projs: ' + projectiles.length);
        console.log('proj x: ' + projectile.x);
        console.log('proj y: ' + projectile.y);
        
    }
    
    // ---------------------------------------------- public methods
    this.spawn = function (x, y) {
        
        projectile.x = ship.x + x;
        projectile.y = ship.y + y;

        // setup listener to listen for ticker to control animation
        createjs.Ticker.addEventListener('tick', move);
        stage.addChild(projectile);
        createjs.Sound.play('shipFire');
        
    };
    
    this.remove = function () {
        removeMe();
    };
    
    function removeMe() {
        createjs.Ticker.removeEventListener('tick', move);
        //projectile.x = -100;
        //projectile.y = -100;
        stage.removeChild(projectile);
        projectiles.splice(projectiles.indexOf(id), 1);
    }
    
};