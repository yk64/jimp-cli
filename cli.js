#!/usr/bin/env node

var program = require('commander');
var resize = require('./actions/resize');
var rotate = require('./actions/rotate');
var brightness = require('./actions/brightness');
var crop = require('./actions/crop');
var quality = require('./actions/quality');

program
	.version('0.0.1')
	.description('Image manipulation in JavaScript.')
	.option('-q --quality <quality>', 'Jpeg quality between 0-100')
	.option('-o --out-file <name>', 'Name of the output file. Size strings will be appended to this file name')
	.option('-d --out-dir <dir>', 'Path to the output directory');

program
	.command('resize <image> <sizes...>')
	.alias('rs')
	.description('Resize an image')
	.option('-c --crop', 'Hard crop an image to the specified sizes')
	.option('-f --fill', 'Image will be stretched to specified sizes')
	.action(resize);

program
	.command('rotate <image> <deg>')
	.alias('ro')
	.description('Rotate an image')
	.action(rotate);

program
	.command('brightness <image> <brightness>')
	.description('Adjust the brightness by a value -1 to +1')
	.action(brightness);

program
	.command('crop <image> <x> <y> <w> <h>')
	.description('Crop image to x, y, w, h')
	.action(crop);

program
	.command('quality <image> <quality>')
	.description('Set jpeg quality to a value from 0 to 100')
	.action(quality);


program.parse(process.argv);
