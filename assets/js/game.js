$(function () {
	'use strict';
	
	function construct() {

		// declare variables
		var game, context, frameRate, background;

		// set the variables
		game      = document.getElementById('game');
		context   = game.getContext('2d');
        frameRate = 24;

		// set the game's properties
		game.width  = window.innerWidth;
		game.height = window.innerHeight;
		
		background = new Image();
		background.src = 'assets/gfx/background/layer1.png';

		// Make sure the image is loaded first otherwise nothing will draw.
		background.onload = function () {
			context.drawImage(background, 0, 0);
		};

		// apply parallax effect to background
		//$('.parallax-layer').parallax({
		//	mouseport: $('#background')
		//});
		
        function handleFileLoad(e) {
            // A sound has been preloaded.
            createjs.Sound.play(e.src);
        }
        
        // Firefox and Opera will load "music.ogg"
        // Browsers with MP3 support will load "music.mp3"
        createjs.Sound.alternateExtensions = ['mp3'];
        createjs.Sound.registerSound({id: 'backgroundMusic', src: 'assets/sfx/music.mp3'});
        createjs.Sound.addEventListener('fileload', handleFileLoad);
        
	}
	
	construct();
	
});