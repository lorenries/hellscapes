"use strict";

var fitText = (function() {

	var fitterHappierText = require('fitter-happier-text');

	var nodes = document.querySelectorAll('.fitter-happier-text');

	fitterHappierText(nodes, { paddingY: 2 });

	}());

module.exports = fitText;
