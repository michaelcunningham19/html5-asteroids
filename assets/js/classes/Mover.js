MoverDirection = {
    'LEFT': 1,
    'RIGHT': 2,
    'UP': 3,
    'DOWN': 4
};

function Mover(sprite, stage) {
    'use strict';
    
    var speed, direction, moving, eventOffStage;
    
    // private property variables
    speed     = 2;
	direction = MoverDirection.LEFT;
    moving    = false;
    
    // construct custom event object for object moving off stage
    eventOffStage = new createjs.Event('onOffStage', true);
    
    // sprite not animating on construction
    sprite.stop();
    
    // --------------------------------------------------- get/set methods
    this.setSpeed = function (value) {
        speed = value;
    };
    
    this.getSpeed = function () {
        return speed;
    };
    
    this.setDirection = function (value) {
        direction = value;
    };
    
    this.getMoving = function () {
        return moving;
    };
    
    // -------------------------------------------------- event handlers
    function onMove(e) {
        
        // get current width of sprite on this frame
        // we only need to concern ourselves with width in terms of off stage since we rotate sprite up, down, left, and right
        var width = sprite.getBounds().width;
        
        if (direction === MoverDirection.LEFT) {
            
            // moving left
            sprite.scaleX   = 1;
            //sprite.rotation = 0;
            sprite.x        = sprite.x - speed;
            
            if (sprite.x < -width) {
                sprite.x = stage.canvas.width;
                sprite.dispatchEvent(eventOffStage);
            }

        } else if (direction === MoverDirection.RIGHT) {
            
            // moving right
            sprite.scaleX   = -1;
            //sprite.rotation = 0;
            sprite.x        = sprite.x + speed;
            
            if (sprite.x > (stage.canvas.width + width)) {
                sprite.x = -width;
                sprite.dispatchEvent(eventOffStage);
            }

        } else if (direction === MoverDirection.UP) {
            
            // moving up
            sprite.scaleX   = 1;
            //sprite.rotation = 90;
            sprite.y        = sprite.y - speed;
            
            if (sprite.y < -width) {
                sprite.y = stage.canvas.height;
                sprite.dispatchEvent(eventOffStage);
            }

        } else if (direction === MoverDirection.DOWN) {
            
            // moving down
            sprite.scaleX   = 1;
            //sprite.rotation = -90;
            sprite.y        = sprite.y + speed;
            
            if (sprite.y > (stage.canvas.height + width)) {
                sprite.y = -width;
                sprite.dispatchEvent(eventOffStage);
            }
            
        }
        
    }
    
    // --------------------------------------------------- public methods
    this.startMe = function () {
        
        if (!moving) {
            
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