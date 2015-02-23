var Spaceship = function(stage, assetManager, maxSpeed) {
    
    // initialization
    var killed;
    
    // to keep track of scope
    var myScope = this;

    // construct custom event objects
    var eventAsteroidDestroyed = new createjs.Event('onShipDestroyed', true);
    var eventShipSpeedChange   = new createjs.Event('onShipSpeedChange', true);

    // grab clip for spaceship and add to stage canvas
    var clip = assetManager.getSprite('assets');
    var clipMover = new Mover(clip, stage);
    stage.addChild(clip);

    // ---------------------------------------------- get/set methods
    this.getKilled = function() {
        return killed;
    };

    this.getClip = function() {
        return clip;
    };
    
    this.getSpeed = function() {
        return clipMover.getSpeed();        
    };

    // ---------------------------------------------- public methods
    this.setupMe = function() {
        killed = false;
    };
	
    this.startMe = function(direction) {
        clipMover.setDirection(direction);
        if (!clipMover.getMoving()) {
            clip.gotoAndPlay('spaceshipMoving');
            clipMover.startMe();
        }
    };	

    this.stopMe = function() {
        
        // stop animation and movement
        clip.stop();
        clipMover.stopMe();
    };

    this.resetMe = function() {
        clip.gotoAndStop('spaceshipIdle');
        clip.x = 280;
        clip.y = 300;
        clipMover.setSpeed(maxSpeed);
    };

    this.killMe = function() {
        if (!killed) {
            
            killed = true;
            clipMover.stopMe();
            
            clip.gotoAndPlay('spaceshipDestroyed');
            clip.addEventListener('animationend', onKilled);
        }
    };

    // ----------------------------------------------- event handlers
    function onKilled(e) {
        
        // cleanup
        clip.stop();
        clip.removeEventListener('animationend', onKilled);
        
        // dispatch event that snake has been killed!
        clip.dispatchEvent(eventShipDestroyed);
    }
};