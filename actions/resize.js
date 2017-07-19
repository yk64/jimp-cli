var Jimp = require('Jimp');
var utils = require('../utils');
var R = require('ramda');


/**
 * Get a valid mode
 * given an alias
 *
 * @param alias
 * @returns {string|string|string|*|number}
 */
function getMode(alias) {
	var modes = [
		{ mode: 'contain', aliases: ['contain', 'cn'] },
		{ mode: 'cover', aliases: ['cover', 'crop', 'cr', 'c'] },
		{ mode: 'resize', aliases: ['resize', 'fill', 'fl', 'f'] }
	];

	return modes.reduce(function (output, mode) {
		return output || (mode.aliases.indexOf(alias) !== -1 && mode.mode);
	}, false);
}


/**
 * Parse the sizes options
 * into usable sizes
 *
 * @param sizes
 * @param defaultMode
 * @returns {Array.<T>}
 */
function parseSizes(sizes, defaultMode) {
	return sizes
		.map(function (size) {
			var matches = size.match(/^([a-z]+)?(\d+)(?:x(\d+))?$/);
			var mode = matches[1] || defaultMode;

			return matches && {
				mode: getMode(mode),
				width: parseInt(matches[2], 10),
				height: parseInt(matches[3] || matches[2], 10)
			};
		})
		.filter(function (size) {
			return size && size.mode && size.width && size.height;
		});
}


/**
 * Resize/contain/crop
 * a given image to the
 * specified sizes
 *
 * @param src
 * @param sizes
 * @param options
 */
module.exports = function resize(src, sizes, options) {
	if (options.crop && options.fill) {
		throw new Error('Image resize cannot have both the crop and fill flags set');
	}
	const mergedOptions = R.mergeAll(
		[
			{ quality: 80 },
			options.parent,
			options,
		]
	)
	var quality = Number(mergedOptions.quality) ;

	var defaultMode = (options.crop && 'crop')
		|| (options.fill && 'fill')
		|| 'contain';

	var validSizes = parseSizes(sizes, defaultMode);
	if (!validSizes.length) {
		throw new Error('Image resize rules were not valid');
	}

	var getOutputFile = utils.getOutputFileGenerator(src, options);
	new Jimp(src, function (err, image) {
		if (err) {
			throw (err);
		}

		validSizes.forEach(function (size) {
			if (typeof image[size.mode] === 'function') {
				image.clone()[size.mode](size.width, size.height)
					.quality(quality)
					.write(getOutputFile(src, [size.width + 'x' + size.height]));
			}

			console.log(
				'Image %s resized:', src,
				'mode', size.mode,
				'width', size.width,
				'height', size.height,
				'quality', quality
			);
		});
	});
};
