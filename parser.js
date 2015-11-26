var TAG_LIST = require('./configurations/default/definedTags.js');

var newparser = (function() {
    var exports = {};

    /**
     * Parses a file from a String into a documentation object.
     * @method parseFile
     * @param  {String} file File to be parsed.
     * @return {Object} Parsed documentation object.
     */
    exports.parseFile = function(file) {

        /**
         * TODO:
         * 	- Multi-line tag support.
         * 	- Configurify everything.
         * 	- Error support.
         * 	- Read file line by line?
         * 		- For line number.
         * 		- Easier multi-line tags.
         */

        var textBlocks = findBlocks(file);
        var objectBlocks = [];
        textBlocks.forEach(function(textBlock) {
            objectBlocks.push(convertToObject(textBlock));
        });

        // We are assembling objects into modules here.
        return assembleObjects(objectBlocks, ['module']);
    }

    /**
     * Extracts comment blocks from the file.
     * @param  {String} file File being parsed.
     * @return {Array} Set of comment blocks as string.
     */
    function findBlocks(file) {

        // TODO: Make better.
        var start = "\/\*\*";
        var end = "\*\/";

        var blockRegex = /\/\*{2}([\s\S]+?)\*\//g;
        var blocks = file.match(blockRegex);

        return blocks;
    };

    /**
     * Converts a block of text into a single object.
     * @param  {String} textBlock Documentation text block.
     * @return {Object} Documentation object.
     */
    function convertToObject(textBlock) {
        var textLines = splitTextBlock(textBlock);

        var blockObjects = [];
        textLines.forEach(function(textLine) {
            textLine = textLine.trim();
            var words = textLine.split(' ');

            // The tag word starts with an @
            if(!words[1] || words[1].indexOf('@') !== 0) {
                // Error; not a tag.
                // return null; //WORD_NOT_A_TAG
                return;
            }

            var tagType = words[1].substring(1);
            var tagFunction = TAG_LIST[tagType];

            // A parsing function should have been defined.
            if(!isFunction(tagFunction)) {
                // Error; no tag line parser found.
                // return null; //NO_TAG_PARSER
                console.log('adadad');
                return;
            }

            // TODO: Remove tagType
            blockObjects.push(tagFunction(words, tagType));
        });

        // We are parsing text into module and function objects here.
        var containers = ['module', 'function'];
        return assembleObjects(blockObjects, containers)
    }

    /**
     * Assembles an array of objects into a single object.
     * @param  {Object} objects  Objects being assembled together.
     * @param  {Array} containers Array of strings indicating which tag types are the main containers.
     * @return {Object} assembled The assembled object.
     */
    function assembleObjects(objects, containers) {
        var assembled = {};
        var hasMain = false;

        objects.forEach(function(item) {
            if(containers.indexOf(item.type) > -1 && !hasMain) {
                // If this item is a container,
                assembled.type = item.type;
                assembled.name = item.name;
                hasMain = true;
            } else if(containers.indexOf(item.type) > -1 && hasMain) {
                // If there was already a container item, ignore this one.
                return; // Error; two containers present.
            } else {
                // Otherwise, put the item in the container.
                assembled[item.type] = assembled[item.type] || [];
                assembled[item.type].push(item);
            }
        });

        if(!hasMain) {
            // Error; no main tag type.
        }

        return assembled;
    }

    /**
     * Utility function to split a comment block into comment lines.
     * @param  {String} block Comment block.
     * @return {Array} Comment lines.
     */
    function splitTextBlock(textBlock) {
        return textBlock.split('\n');
    }

    /**
     * Utility function to check whether an object is a function.
     * @param  {Something} object Object being checked.
     * @return {Boolean} isFunction Result of the check.
     */
    function isFunction(object) {
        return typeof object === 'function';
    }

    return exports;
})();

module.exports = newparser;
