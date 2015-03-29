// game variable declaration
var stage, canvas, context, upKey, leftKey, rightKey, spaceBar, frameRate, asteroidTimer, asteroidDelay, asteroidsDestroyed, currentAsteroids, assetManager, mnuStartMenu, mnuGameOver, ship, lblDestroyed, lblTimer, lblFPS, isBgMusicPlaying, btnVolume, icoVolume, sprDestroyed, sprTimer, isRestart, projectiles;

// game variable initialization
upKey              = false;
leftKey            = false;
rightKey           = false;
spaceBar           = false;
isRestart          = false;
isBgMusicPlaying   = true;
frameRate          = 45;
asteroidTimer      = null;
asteroidDelay      = 1500;
currentAsteroids   = 0;
asteroidsDestroyed = 0;
projectiles        = [];

function onInit() {
	'use strict';
	
	// get reference to canvas
	canvas = document.getElementById('stage');
	
	// set canvas to as wide/high as the browser window
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
    
	// create stage object
    stage = new createjs.Stage(canvas);

	// construct preloader object to load spritesheet and sound assets
	assetManager = new AssetManager();
    stage.addEventListener('onAllAssetsLoaded', onSetup);
	
    // load the assets
    assetManager.loadAssets(manifest);
    
}

function onKeyDown(e) {
	'use strict';
	
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
	'use strict';
	
	switch (e.keyCode) {
			
	case 37:
		leftKey = false;
		break;

	case 38:
		upKey = false;
		break;

	case 39:
		rightKey = false;
		break;
            
    case 32:
        spaceBar = false;
        break;
            
    }
}

function onAddAsteroid(e) {
	'use strict';
    
    if (currentAsteroids < 11) {
        
        // add asteroid to the stage
        var asteroid = new Asteroid(stage, assetManager, ship);
        asteroid.setupMe();
        
        currentAsteroids += 1;
        
    }
	
}

function onAsteroidDestroyed() {
	'use strict';
	
    // increment asteroids destroyed counter
    asteroidsDestroyed += 1;
    
    // decrement current asteroids counter
    currentAsteroids -= 1;
    
    // update the label
    lblDestroyed.innerHTML = asteroidsDestroyed;

    // decrease the amount of asteroids on the screen every ten asteroids destroyed
    if ((asteroidsDestroyed % 10) === 0) {
        asteroidDelay += 500;
        window.clearInterval(asteroidTimer);
		asteroidTimer = window.setInterval(onAddAsteroid, asteroidDelay);
    }
}

function onGameOver() {
	'use strict';
	
    // gameOver
    window.clearInterval(asteroidTimer);
    stage.addChild(mnuGameOver);
    
    Timer.stop();

    // add listener to reset game when click background
    mnuGameOver.addEventListener('click', function() {
        
        // kill event listener and add listener to start a new game again
        mnuGameOver.removeEventListener('click', this);

        ship.reset();

        isRestart = true;
        upKey     = false;
        leftKey   = false;
        rightKey  = false;
        spaceBar  = false;

        onStartGame();
        
    });

    // remove all listeners
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
}

function onTick(e) {
	'use strict';

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
    'use strict';
    
    if (isBgMusicPlaying) {

        createjs.Sound.stop('backgroundMusic');
        isBgMusicPlaying = false;
        icoVolume.className = 'icon-volume-off';

    } else {

        createjs.Sound.play('backgroundMusic');
        isBgMusicPlaying = true;
        icoVolume.className = 'icon-volume-up';

    }
    
}

function onStartGame(e) {
	'use strict';
    
    if (isRestart) {
        stage.removeChild(mnuGameOver);   
    } else {
        stage.removeChild(mnuStartMenu);   
    }
    
    mnuStartMenu.removeEventListener('destroyed', onStartGame);

    // construct and setup asteroidtimer to drop asteroids on displaylist
    asteroidsDestroyed = 0;
    asteroidTimer      = window.setInterval(onAddAsteroid, asteroidDelay);
    
    if (isBgMusicPlaying) {
        toggleBGMusic();
    }

    // current state of keys
    leftKey  = false;
    rightKey = false;
    upKey    = false;
    
    // start the timer
    if (isRestart) {
        Timer.restart();
    } else {
        Timer.init();
    }

    // setup event listeners for keyboard keys
	document.addEventListener('keydown', onKeyDown);
	document.addEventListener('keyup', onKeyUp);
}

function onSetup() {
	'use strict';
    
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
    mnuStartMenu   = assetManager.getSprite('assets', 'startmenu');
    mnuStartMenu.x = (window.innerWidth / 2) - 250;
    mnuStartMenu.y = (window.innerHeight / 2) - 250;
    
    // construct the game over sprite
    mnuGameOver   = assetManager.getSprite('assets', 'gameovermenu');
    mnuGameOver.x = (window.innerWidth / 2) - 250;
    mnuGameOver.y = (window.innerHeight / 2) - 250;
    
    // construct the destroyed counter sprite
    sprDestroyed   = assetManager.getSprite('assets', 'counterlabel');
    sprDestroyed.x = 50;
    sprDestroyed.y = window.innerHeight - 100;
    
    // construct the timer sprite
    sprTimer   = assetManager.getSprite('assets', 'timelabel');
    sprTimer.x = window.innerWidth - 195;
    sprTimer.y = window.innerHeight - 100;
    
    // construct the spaceship sprite
    ship = new Spaceship(stage, assetManager);
    ship.reset();
    
    // add applicable sprites to stage
    stage.addChild(mnuStartMenu);
    stage.addChild(sprTimer);
    stage.addChild(sprDestroyed);
    
    // setup game event listeners to listen on the capture phase
    stage.addEventListener('onAsteroidDestroyed', onAsteroidDestroyed, true);
	stage.addEventListener('onShipDestroyed', onGameOver, true);
    
    // startup the ticker
    createjs.Ticker.setFPS(frameRate);
    createjs.Ticker.addEventListener('tick', onTick);
    
    createjs.Sound.play('backgroundMusic');
    
    // setup event listener to start game
    mnuStartMenu.addEventListener('click', onStartGame);

}

// entry point
window.addEventListener('load', onInit);