"use strict";

function fitText(selector, padding) {

	var fitterHappierText = require('fitter-happier-text');

	var nodes = document.querySelectorAll(selector);

	fitterHappierText(nodes, { paddingY: padding });

	};

module.exports = fitText;
