'use strict';
var parser = require('./parser.js');
var readSync = require('read-file-relative').readSync;

/**
 * TODO:
 * 	- Allow multi-file modules.
 * 		- Merge them.
 */

var confDoc = (function() {
    var exports = {};

    exports.parseFile = parser.parseFile;

    exports.parse = function(files) {
        var everything = {
            modules: []
        };

        files.forEach(function(file) {
            console.log('file', file);
            var data = readSync(file);
            var moduleDoc = parser.parseFile(data);

            if(typeof moduleDoc.name === 'undefined') {
                moduleDoc.name = path.basename(file);
            }

            everything.modules.push();
        });

        return everything;
    };

    return exports;
})();

module.exports = confDoc;
