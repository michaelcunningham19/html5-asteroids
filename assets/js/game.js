// game variable declaration
var stage, canvas, context, upKey, leftKey, rightKey, spaceBar, frameRate, asteroidTimer, asteroidDelay, asteroidsDestroyed, asteroidID, currentProjectiles, assetManager, mnuStartMenu, mnuGameOver, ship, lblDestroyed, lblTimer, lblFPS, btnVolume, icoVolume, sprDestroyed, sprTimer, isRestart, projectiles;

// game variable initialization
upKey              = false;
leftKey            = false;
rightKey           = false;
spaceBar           = false;
isRestart          = false;
frameRate          = 45;
asteroidTimer      = null;
asteroidDelay      = 1500;
asteroidID         = 1;
projectileID       = 1;
asteroidsDestroyed = 0;
projectiles        = [];
asteroids          = [];

function onInit() {
	
	// get reference to canvas
	canvas = document.getElementById('stage');
	
	// set canvas to as wide/high as the browser window
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
    
	// create stage object
    stage = new createjs.Stage(canvas);

	// construct preloader object to load spritesheet and sound assets
	assetManager = new AssetManager(document.getElementById('progress'), document.querySelector('#progressbar .bar'));
    stage.addEventListener('onAllAssetsLoaded', onSetup);
	
    // load the assets
    assetManager.loadAssets(manifest);
    
}

function onKeyDown(e) {
	
	switch (e.keyCode) {
			
	case 37:
		leftKey = true;
		break;
			
	case 38:
		upKey = true;
		break;

	case 39:
		rightKey = true;
		break;
            
    case 32:
        spaceBar = true;
        break;
            
    }
}

function onKeyUp(e) {
	
	switch (e.keyCode) {
			
        case 37 :
            leftKey = false;
        break;

        case 38 :
            upKey = false;
        break;

        case 39 :
            rightKey = false;
        break;

        case 32 :
            spaceBar = false;
        break;
            
    }
}

function onAddAsteroid(e) {
    
    if ((asteroids.length < 10) && (!isRestart)) {
        
        console.log("adding asteroid : " + asteroidID);
        var asteroid = new Asteroid(stage, assetManager, ship, asteroidID);
        asteroid.setup();
        // add asteroid to the stage
        asteroids.push(asteroid);
        
        asteroidID++;
        
        console.log('# of asteroids: ' + asteroids.length);
        
    }
	
}

function onAsteroidDestroyed() {

    asteroidsDestroyed++;
    
    // decrease delay at which asteroids are spawned
    asteroidDelay -= 50;
    
    // if the delay gets too low, reset to default
    if (asteroidDelay === 300) {
        asteroidDelay = 1500;
    }
    
    // update the label
    lblDestroyed.innerHTML = asteroidsDestroyed;

}

function onGameOver() {

    window.clearInterval(asteroidTimer);
    Timer.stop();

    // remove all listeners
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
    
    // add listener to reset game when click background
    stage.addChild(mnuGameOver);
    mnuGameOver.addEventListener('click', onGameRestart);
}

function onGameRestart() {
    
    isRestart = true;
    
    // nuke 'er
    stage.removeChild(mnuGameOver);
    mnuGameOver.removeEventListener('click', onGameRestart);
    
    stage.removeAllEventListeners();
    stage.removeAllChildren();
    stage.update();

    mnuStartMenu.addEventListener('click', onStartGame);
    
    stage.addChild(sprDestroyed);
    stage.addChild(sprTimer);
    ship.reset();
    
    asteroidsDestroyed = 0;
    lblDestroyed.innerHTML = asteroidsDestroyed;
    
    for (var x = 0; x < asteroids.length; x++) {
        asteroids[x].destroyMe(false);
    }
    
    projectiles   = [];
    asteroids     = [];
    asteroidID    = 1;
    asteroidDelay = 1500;
    
    stage.addChild(mnuStartMenu);
    
}

function onTick(e) {

    lblFPS.innerHTML = createjs.Ticker.getMeasuredFPS();

    // only monitor keyboard if ship is alive
    if (!ship.isDestroyed()) {
        if (leftKey) {
            ship.rotate(1);     // 1 = left
        } else if (rightKey) {
            ship.rotate(2);     // 2 = right
        } else if (upKey) {
            ship.accelerate(3); // 3 = up
        } else if (spaceBar) {
            ship.fire();
        } else {
            ship.accelerate();
        }
    }

    // update the stage!
	stage.update();
}

function toggleBGMusic() {
 
    if (icoVolume.className === 'icon-volume-up') {
        createjs.Sound.stop('backgroundMusic');
        icoVolume.className = 'icon-volume-off';
    } else {
        createjs.Sound.play('backgroundMusic');
        icoVolume.className = 'icon-volume-up';
    }
    
}

function onStartGame(e) {
        
    stage.removeChild(mnuStartMenu);
    mnuStartMenu.removeEventListener('click', onStartGame);

    // construct and setup asteroidtimer to drop asteroids on displaylist
    asteroidsDestroyed = 0;
    asteroidTimer      = window.setInterval(onAddAsteroid, asteroidDelay);

    if (icoVolume.className === 'icon-volume-up') {
        toggleBGMusic();
    }

    // current state of keys
    leftKey  = false;
    rightKey = false;
    upKey    = false;
    
    // start the timer
    if (isRestart) {
        Timer.restart();
        isRestart = false;
    } else {
        Timer.init();
    }
    
    var x = document.querySelectorAll('.label');
    for (var i = 0; i < x.length; i++) {
        x[i].style.visibility = 'visible';   
    }
    
    stage.addChild(sprTimer);
    stage.addChild(sprDestroyed);

    // setup event listeners for keyboard keys
	document.addEventListener('keydown', onKeyDown);
	document.addEventListener('keyup', onKeyUp);
    
    ship.reset();
    
}

function onSetup() {
    
	// kill event listener
	stage.removeEventListener('onAllAssetsLoaded', onSetup);
    
    // initialize stage objects
    lblDestroyed = document.getElementById('lblDestroyed');
    lblTimer     = document.getElementById('lblTimer');
    lblFPS       = document.getElementById('lblFPS');
    btnVolume    = document.getElementById('btnVolume');
    icoVolume    = document.querySelector('#btnVolume i');
    
    // populate destroyed counter and timer with initial values
    lblDestroyed.innerHTML = '0';
    lblTimer.innerHTML     = '--:--';
    
    // wire up the background music button logic
    btnVolume.addEventListener('click', toggleBGMusic);

    // ------------------------------------------ construct game objects
    // construct main menu sprite
    mnuStartMenu = assetManager.getSprite('assets', 'startmenu');
    mnuStartMenu.x = (window.innerWidth / 2) - 250;
    mnuStartMenu.y = (window.innerHeight / 2) - 250;
    
    // construct the game over sprite
    mnuGameOver = assetManager.getSprite('assets', 'gameovermenu');
    mnuGameOver.x = (window.innerWidth / 2) - 250;
    mnuGameOver.y = (window.innerHeight / 2) - 250;
    
    // construct the destroyed counter sprite
    sprDestroyed = assetManager.getSprite('assets', 'counterlabel');
    sprDestroyed.x = 50;
    sprDestroyed.y = window.innerHeight - 100;
    
    // construct the timer sprite
    sprTimer = assetManager.getSprite('assets', 'timelabel');
    sprTimer.x = window.innerWidth - 195;
    sprTimer.y = window.innerHeight - 100;
    
    // add applicable sprites to stage
    stage.addChild(mnuStartMenu);
    
    btnVolume.style.visibility = 'visible';
    
    // construct the spaceship sprite
    ship = new Spaceship(stage, assetManager);
    
    // startup the ticker
    createjs.Ticker.setFPS(frameRate);
    createjs.Ticker.addEventListener('tick', onTick);
    
    createjs.Sound.play('backgroundMusic');
    
    // setup event listener to start game
    mnuStartMenu.addEventListener('click', onStartGame);

}

// entry point
window.addEventListener('load', onInit);