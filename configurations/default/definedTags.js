'use strict';

//TODO: Remove hardcoded numbers.
//TODO: Change method to functions.
/**
 * List of defined tag types, and their parsing functions. TODO.
 * @name TAG_LIST
 * @type {Object}
 */
var definedTags = (function() {
    var exports = {};

    /**
     * Generates documented tag objects as documentation objects.
     * @param  {String} type Type of tag being parsed.
     * @param  {String} name Name of tag item being parsed.
     * @param  {Object} props Properties of the tag item.
     * @return {docob} docob Docob (real descriptive, I know, TODO).
     */
    function docob(type, name, props) {
        this.type = type;
        this.name = name;
        this.props = props;
    }

    exports.descTag = 'desc';
    exports.definedTags = {
        // TODO: turn the complicated/common ones into separate functions.

        /**
         * Desc tag parser.
         * @param  {Array} words Documentation line, split on spaces.
         * @return {docob} docob Docob (real descriptive, I know, TODO).
         */
        'desc': function(words) {
            // Determine between a tagless and a tagged desc.
            var descString;
            if(words[0].indexOf('@desc') === 0) {
                descString = words.splice(1).join(' ');
            } else {
                descString = words.join(' ');
            }

            var tagType = 'desc';
            var innards = {
                desc: descString
            };
            return new docob(tagType, "", innards);
        },
        /**
         * Method tag parser.
         * @param  {Array} words Documentation line, split on spaces.
         * @expects words  ['@method', 'functionName']
         * @return {docob} docob Docob (real descriptive, I know, TODO).
         */
        'method': function(words) {
            var tagType = 'function';
            var name = words[1];
            return new docob(tagType, name);
        },
        /**
         * Module tag parser.
         * @param  {Array} words Documentation line, split on spaces.
         * @expects words  ['@module', 'moduleName']
         * @return {docob} docob Docob (real descriptive, I know, TODO).
         */
        'module': function(words) {
            var tagType = 'module';
            var name = words[1];
            return new docob(tagType, name);
        },
        /**
         * Param tag parser.
         * @param  {Array} words Documentation line, split on spaces.
         * @expects words  ['@param', '{Type}', 'paramName', 'Description', 'goes', 'here', ...]
         * @return {docob} docob Docob (real descriptive, I know, TODO).
         */
        'param': function(words, tagType) {
            var tagType = 'param';
            var name = words[2];
            var innards = {
                type: words[1].substring(1, words[1].length - 1),
                desc: words.splice(3).join(" ")
            };
            return new docob(tagType, name, innards);
        },
        /**
         * Return tag parser.
         * @param  {Array} words Documentation line, split on spaces.
         * @expects words  ['@returns', '{Type}', 'returnName', 'Description', 'goes', 'here', ...]
         * @return {docob} docob Docob (real descriptive, I know, TODO).
         */
        'returns': function(words) {
            var tagType = 'return';
            var name = words[2];
            var innards = {
                returnType: words[1].substring(1, words[1].length - 1),
                desc: words.splice(3).join(" ")
            };
            return new docob(tagType, name, innards);
        }
    }

    return exports;
})();

module.exports = definedTags;
