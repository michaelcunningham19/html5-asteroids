$(function () {
	'use strict';
	
	function construct() {

		// declare variables
		var game, context;

		// set the variables
		game    = document.getElementById('game');
		context = game.getContext('2d');

		// set the game's properties
		context.fillStyle = '#000';
		context.fillRect(0, 0, window.innerWidth, window.innerHeight);
		
		// apply parallax effect to background
		$('.parallax-layer').parallax({
			mouseport: $('#background')
		});
		
	}
	
	construct();
	
});