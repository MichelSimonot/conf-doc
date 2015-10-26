'use strict';

//TODO: Remove hardcoded numbers.
/**
 * List of defined tag types, and their parsing functions. TODO.
 * @name TAG_LIST
 * @type {Object}
 */
var definedTags = (function() {
    var exports = {};

    exports.definedTags = {
        'method': function(components) {
            return {
                tagType: 'function',
                name: components[2]
            };
        },
        'param': function(components, tagType) {
            var varType = components[2].substring(1, components[2].length - 1);
            var varDesc = components.splice(4).join(" ");
            return {
                tagType: 'param',
                type: varType,
                name: components[3],
                desc: varDesc
            };
        },
        'returns': function(components) {
            // TODO: turn the complicated/common ones into separate functions.
            return {
                tagType: 'return',
                type: components[2].substring(1, components[2].length - 1),
                name: components[3],
                desc: components.splice(4).join(" ")
            };
        },

        'module': function(components) {
            return {
                tagType: 'module',
                name: components[2]
            };
        }
    }

    return exports.definedTags;
})();

module.exports = definedTags;
