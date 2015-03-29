var Projectile = function (ship, stage, assetManager) {
    'use strict';
    
    var projectile      = assetManager.getSprite('assets', 'projectile');
    projectile.rotation = ship.rotation;
    
    // ---------------------------------------------- get/set methods
    this.getClip = function () {
        return projectile;
    };
    
    // ---------------------------------------------- private methods
    function moveMe() {
        projectile.y = projectile.y - 20 * Math.cos(projectile.rotation * Math.PI / 180);
        projectile.x = projectile.x + 20 * Math.sin(projectile.rotation * Math.PI / 180);
    }
    
    // ---------------------------------------------- public methods
    this.spawn = function (x, y) {
        
        projectile.x = ship.x + x;
        projectile.y = ship.y + y;

        // setup listener to listen for ticker to control animation
        createjs.Ticker.addEventListener('tick', moveMe);
        stage.addChild(projectile);
        createjs.Sound.play('shipFire');
        
    };
    
    this.remove = function () {
        projectile.x = -100;
        projectile.y = -100;
        createjs.Ticker.removeEventListener('tick', moveMe);
        stage.removeChild(projectile);
    };
    
};