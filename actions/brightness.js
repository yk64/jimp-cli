var Jimp = require('Jimp');
var utils = require('../utils');
var R = require('ramda');
/**
 * Adjust brightness of a given image
 * with the specified option
  *
 * @param src
 * @param brightness
 */
module.exports = function brightness(src, brightness) {
    console.log(brightness);
    var blightnessVal = Number(brightness);
    if (isNaN(blightnessVal)) {
    	throw new TypeError('Jimp brightness expects brightness to be a number. "' + brightness + '" given');
    }

    var getOutputFile = utils.getOutputFileGenerator(src, blightnessVal);

    new Jimp(src, function (err, image) {
        if (err) {
            throw err;
        }
        image
            .brightness(blightnessVal)
            .write(getOutputFile(src, ['brightened', blightnessVal]));

        console.log('Image %s\'s brightness has been adjusted by %f', src, blightnessVal);
    });
};
