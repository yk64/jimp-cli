var Jimp = require('Jimp');
var utils = require('../utils');
var R = require('ramda');
/**
 * Crop image to the specified size
 *
 * @param src
 * @param x, y, w, h
 */
module.exports = function crop(src, x, y, w, h) {
    const values = R.map(v => Number(v), { x, y, w, h });
    console.log('values', values);

    R.forEachObjIndexed((value, key) => {
        console.log('value', value);

        if (isNaN(value)) {
            throw new TypeError(`Jimp crop expects ${key} to be a number.  "${value}" given`);
        }
    }, values);


    var getOutputFile = utils.getOutputFileGenerator(src, values);


    new Jimp(src, function (err, image) {
        if (err) {
            throw err;
        }
        const {x,y,w,h} = values;
        image
            .crop(x, y, w, h)
            .write(getOutputFile(src, ['cropped', `${x}_${y}_${w}_${h}`]));

        console.log('Image %s\ has been cropped x:%f y:%f w:%f h:%f', src, x,y,w,h);
    });
};
