"use strict";

var animations = (function() {

	var anime = require('animejs');

	var zombie = document.querySelector('#zombie svg');

	zombie.addEventListener("mouseover", function() {zombieBounce.pause(); lineDrawing.pause()});

	zombie.addEventListener("mouseout", function() {zombieBounce.play()});

	var lineDrawing = anime({
	  targets: '#zombie path',
	  // strokeDashoffset: [anime.setDashoffset, 0], // animate the line drawing
	  easing: 'easeInOutSine',
	  duration: 1100,
	  delay: function(el, i) { return i * 250 },
	  stroke: [
	    {value: '#FFF'}, // Or #FFFFFF
	    {value: '#B20000'}
	  ],  
	  direction: 'alternate',
	  loop: true
	});

	var eyes = anime({
	  targets: '#zombie circle',
	  strokeDashoffset: [anime.setDashoffset, 0],
	  easing: 'easeInOutSine',
	  duration: 1100,
	  delay: function(el, i) { return i * 250 },
	  stroke: [
	    {value: '#FFF'}, // Or #FFFFFF
	    {value: '#00B233'}
	  ],  
	  direction: 'alternate',
	  loop: true
	});

	var zombieBounce = anime({
	  targets: '#zombie svg',
	  easing: 'easeInOutSine',
	  duration: 1000,
	  translateY: 20,
	  delay: function(el, i) { return i * 250 },
	  direction: 'alternate',
	  loop: true
	});

}());

module.exports = animations;
