'use strict';
var TAG_LIST = require('./configurations/default/definedTags.js');

var parser = (function() {
    var exports = {};

    /**
     * TODO:
     * 	- Multi-line tag support.
     * 	- Configurify everything.
     * 	- Error support.
     * 	- Read file line by line.
     * 		- For line number.
     * 		- Easier multi-line tags.
     */

    /**
     * Parses a file from a String into a documentation object.
     * @method parseFile
     * @param  {String} file File to be parsed.
     * @return {Object} Parsed documentation object.
     */
    exports.parseFile = function(file) {

        /**
         * Container object for all resulting file documentation objects.
         * @name everything
         * @type {Object}
         */
        var everything = {
            functions: [],
            properties: []
        };

        // Get the comment blocks.
        var codeBlocks = findBlocks(file);

        // Parse each comment block and add it to everything container.
        codeBlocks.forEach(function(block) {
            var block = parseBlock(block);
            //console.log('Block: ' + JSON.stringify(block));
            switch(block.itemType) {
                case 'function':
                    everything.functions.push(block);
                    break;
                case 'module':
                    everything.name = block.name;
                    break;
            };
        });

        return everything;
    }

    /**
     * Extracts comment blocks from the file.
     * @param  {String} file File being parsed.
     * @return {Array} Set of comment blocks as string.
     */
    function findBlocks(file) {

        var start = "\/\*\*";
        var end = "\*\/";

        var blockRegex = /\/\*{2}([\s\S]+?)\*\//g;
        var blocks = file.match(blockRegex);

        return blocks;
    };

    function readFile(filePath) {
        var file = fs.open(filePath, 'r');
    }

    /**
     * Converts a text comment block into an object comment block.
     * @param  {String} block Comment block.
     * @return {Object} Comment block as a JSON object.
     */
    function parseBlock(block) {
        var lines = splitBlock(block);
        var lineObjs = [];

        lines.forEach(function(line) {
            line = line.trim();

            // Split the line into individual words.
            var components = line.split(" ");
            // If there's only one word (a *), then the line is blank.
            if(components.length === 1) {
                // Empty line.
                return;
            }

            // Find if the tag type is defined.
            var tagType = findTag(components[1]);
            if(tagType) {
                // If defined, add the parsed line to a temporary object.
                lineObjs.push(parseLine(components, tagType));
            } else {
                // Error; not a tag.
                return; //COMPONENT_NOT_A_TAG returned from findTag
            }
        });

        // Format all the line documentation objects into a single block documentation object.
        return formatBlock(lineObjs);
    }

    /**
     * Utility function to split a comment block into comment lines.
     * @param  {String} block Comment block.
     * @return {Array} Comment lines.
     */
    function splitBlock(block) {
        return block.split("\n");
    }

    /**
     * Returns the tag name if defined, otherwise TODO
     * @param  {String} tagComponent Documentation component.
     * @return {String} Tag name.
     */
    function findTag(tagComponent) {
        //TODO: Multi-line tag support.
        //Assumes every line is a separate tag.
        //TODO: Do I need this part? Yes, for the different type of error.
        // A tag component starts with an @
        if(tagComponent.indexOf('@') !== 0) {
            // Error; not a tag.
            return null; //COMPONENT_NOT_A_TAG
        }

        tagComponent = tagComponent.substring(1);

        // Checks if the tag type is in the tag list.
        if(typeof TAG_LIST[tagComponent] !== 'undefined') {
            return tagComponent;
        } else {
            return null; //TAG_NOT_DEFINED
        }
    }

    /**
     * Invokes the parsing function specific to the tag type of the line.
     * @param  {Array} components The split (by words) comment line.
     * @param  {String} tagType Name of a defined tag.
     * @return {Object} The comment line as an object.
     */
    function parseLine(components, tagType) {
        // Get then call the function for the tag.
        var tagFunction = TAG_LIST[tagType];
        var output = tagFunction(components, tagType);
        return output;
    }

    /**
     * Converts the comment line objects into a single comment block object.
     * @param  {Array} lineObjs Comment line objects.
     * @return {Object} Comment block object.
     */
    function formatBlock(lineObjs) {
        /**
         * Container object for all resulting block documentation items.
         * @name obj
         * @type {Object}
         */
        var obj = {
            params: []
        };

        // Merge each line object into the block object.
        for(var i = 0; i < lineObjs.length; i++) {
            var item = lineObjs[i];

            switch(item.tagType) {
                //TODO: Don't have this "top-level", to be more consistent with return?
                case 'function':
                    obj.itemType = item.tagType;
                    obj.name = item.name;
                    break;
                case 'param':
                    obj.params.push({
                        type: item.type,
                        name: item.name,
                        desc: item.desc
                    });
                    break;
                case 'return':
                    obj.return = {
                        type: item.type,
                        name: item.name,
                        desc: item.desc
                    };
                    break;
                case 'module':
                    obj.itemType = item.tagType;
                    obj.name = item.name;
                    break;
            }
        }
        return obj;
    }

    //TODO: Export everything for overrideability (?).
    return exports;
})();

module.exports = parser;
