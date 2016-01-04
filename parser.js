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
         * 	- Configurify everything.
         * 	- Error support.
         * 	- Read file line by line?
         * 		- For line number.
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
     * Removes the line prefix from every line of a text block.
     *
     * @method removePrefixes
     * @param  {String} textBlock Block of text to act on.
     * @return {String} Block of text, without prefixes.
     */
    function removePrefixes(textBlock) {
        var linePrefix = '*'; // TODO: Configurify.
        var commentStarter = '/**'; // TODO: Configurify.
        var commentEnder = '*/'; // TODO: Configurify.
        // All the prefixes we want removed.
        var removeMes = [
            commentStarter,
            commentEnder,
            linePrefix
        ];

        var textLines = splitTextBlock(textBlock);
        // Loop over every line and remove the prefix if there is one.
        for(var i = 0; i < textLines.length; i++) {
            textLines[i] = textLines[i].trim();

            // Removes all removeMes in all lines.
            for(var j = 0; j < removeMes.length; j++) {
                if(textLines[i].indexOf(removeMes[j]) === 0) {
                    textLines[i] = (textLines[i].substring(removeMes[j].length)).trim();
                }
            }
        }

        // TODO: Filter out empty textLines here.
        //      Instead of trimming in splitIntoTags,
        //      when multi-line tags are merged.

        return joinTextLines(textLines);
    }

    /**
     * Splits a block of text into the tags it is composed of.
     * @method splitIntoTags
     * @param  {String} textBlock Block of text.
     * @return {Array} Array of tags, in string format.
     */
    function splitIntoTags(textBlock) {
        var tagSymbol = '@'; // TODO: Configurify.
        var tags = [];

        // TODO: Only merge multi-lines for tags
        //      that want them merged.
        //      Ex: @desc, not @example.
        //      Default to merge.

        var textLines = splitTextBlock(textBlock);

        // TODO: Make this better.
        var currentTag = '';
        for(var i = 0; i < textLines.length; i++) {
            // If the lines starts a new tag..
            if(textLines[i].indexOf(tagSymbol) === 0) {
                tags.push(currentTag.trim());
                currentTag = textLines[i];
            } else {
                currentTag += ' ' + textLines[i];
            }
        }
        // Make sure the last tag gets added in.
        tags.push(currentTag.trim());

        return tags;
    }

    /**
     * Converts a block of text into a single object.
     * @param  {String} textBlock Documentation text block.
     * @return {Object} Documentation object.
     */
    function convertToObject(textBlock) {
        // Remove unneeded prefixes from the block.
        textBlock = removePrefixes(textBlock);
        // Split the block into tags.
        var textTags = splitIntoTags(textBlock);

        var blockObjects = [];
        textTags.forEach(function(textTag) {
            textTag = textTag.trim();
            var words = textTag.split(' ');

            // Is this tag text a tagless description?
            if(words[0].indexOf('@') !== 0) {
                // TODO: Should desc be hardcoded? No..
                blockObjects.push(TAG_LIST['desc'](words, 'desc'));
                return;
            }

            var tagType = words[0].substring(1);
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
     * Utility function to join text lines into a text block.
     * Meant as an inverse function to splitTextBlock.
     * @param  {Array} textLines Array of strings to join.
     * @return {String} Text block.
     */
    function joinTextLines(textLines) {
        return textLines.join('\n');
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
