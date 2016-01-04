/**
 * This module is for testing purposes only.
 *
 * @module testFile
 */

/**
 * This is a test file with random stuff in it. By the
 * way, this is a multi-line tagless description.
 *
 * @method doStuff
 * @desc I wonder what happens when you have two descriptions. Oh,
 * it adds both of them to the desc array. Cool.
 * @returns {Integer} forty This return ststetaafaa. Yup.
 *
 * Another tagless sentence. This should be picked up by the @returns tag.
 */
function doStuff() {
    var forty = 40;
    return forty;
}

/**
 * More random stuff with other formatting.
 * This function takes parameters!
 *
 * @method anotherFunction
 * @param {Integer} param This parameter is an integer.
 * @returns {Integer} something This return statement returns an integer.
 */
function anotherFunction(param) {
    var something = 40 + param;
    return something;
}
