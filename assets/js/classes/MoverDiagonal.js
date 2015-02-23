function MoverDiagonal(sprite, stage) {
    'use strict';
    
    var speed, moving, yDisplace, xDisplace, eventOffStage;
    
    // private property variables
    speed  = 2;
    moving = false;
    
    // private variables
    xDisplace = -1;
    yDisplace = -1;
    
    // construct custom event object for object moving off stage
    eventOffStage = new createjs.Event('onMovingDiagonalOffStage', true);
    
    // sprite not animating on construction
    sprite.stop();
    
    // --------------------------------------------------- get/set methods
    this.setSpeed = function (value) {
        speed = value;
    };
    
    this.getMoving = function () {
        return moving;
    };
    
    // -------------------------------------------------- private methods
    function radianMe(degrees) {
        return (degrees * (Math.PI / 180));
    }
    
    // -------------------------------------------------- event handlers
    function onMove(e) {
        
        // move sprite
        sprite.x = sprite.x + xDisplace;
        sprite.y = sprite.y + yDisplace;
        
        var dimensions, width, height;
        
        // get dimenstions of current frame in sprite
        dimensions = sprite.getBounds();
        width      = dimensions.width;
        height     = dimensions.height;

        // check if object is off the stage
        if ((sprite.x < -width) || (sprite.x > (stage.canvas.width + width)) || (sprite.y < -height) || (sprite.y > (stage.canvas.height + height))) {
            sprite.dispatchEvent(eventOffStage);
        }
        
    }
    
    // --------------------------------------------------- public methods
    this.startMe = function () {
        
        if (!moving) {
            
            // convert current rotation of object to radians
            var radians = radianMe(sprite.rotation);
            
            // calculating X and Y displacement
            xDisplace = Math.cos(radians) * speed;
            yDisplace = Math.sin(radians) * speed;
            sprite.play();
            
            // setup listener to listen for ticker to control animation
            createjs.Ticker.addEventListener('tick', onMove);
            moving = true;
        }
        
    };

    this.stopMe = function () {
        
        if (moving) {
            
            sprite.stop();
            
            // remove listener to stop animation
            createjs.Ticker.removeEventListener('tick', onMove);
            moving = false;
        }
        
    };
    
}