"use strict";

var fitText = function(domNodes) {

	var fitterHappierText = require('fitter-happier-text');

	var nodes = document.querySelectorAll(domNodes);

	fitterHappierText(nodes);

	};

module.exports = fitText;
