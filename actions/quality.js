var Jimp = require('Jimp');
var utils = require('../utils');
var R = require('ramda');
/**
 * Adjust quaolity of jpeg image
 * with the specified option (0-100)
  *
 * @param src
 * @param quality
 */
module.exports = function quality(src, quality) {
    var qualityVal = Number(quality);
    if (isNaN(qualityVal) || qualityVal < 0 || qualityVal > 100) {
    	throw new TypeError('Jimp quality expects quality to be a number 0-100. "' + quality + '" given');
    }

    var getOutputFile = utils.getOutputFileGenerator(src, qualityVal);

    new Jimp(src, function (err, image) {
        if (err) {
            throw err;
        }
        image
            .quality(qualityVal)
            .write(getOutputFile(src, ['quality', qualityVal]));

        console.log('Image %s\'s quality has been set to %f', src, qualityVal);
    });
};
