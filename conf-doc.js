'use strict';
var parser = require('./parser.js');
var path = require('path');
var readSync = require('read-file-relative').readSync;

/**
 * TODO:
 * 	- Nothing! (yeah.. right..)
 */

var confDoc = (function() {
    var exports = {};

    exports.parseFile = parser.parseFile;

    exports.parse = function(files) {
        var everything = {
            modules: {}
        };

        files.forEach(function(file) {
            console.log('file', file);
            var data = readSync(file);
            var moduleDoc = parser.parseFile(data);

            if(typeof moduleDoc.name === 'undefined') {
                moduleDoc.name = path.basename(file);
            }

            // TODO: Make this a stand-alone utility function.
            if(typeof everything.modules[moduleDoc.name] !== 'undefined') {


                // Merge extra functions into first functions.
                moduleDoc.functions.forEach(function(func) {
                    // TODO: Check for duplicate function names (?).
                    everything.modules[moduleDoc.name].functions.push(func);
                });

                // Merge extra properties into first functions.
                moduleDoc.properties.forEach(function(property) {
                    // TODO: Check for duplicate property names (?).
                    everything.modules[moduleDoc.name].properties.push(property);
                });

                // The rest should be the same... TODO: verify.
            } else {
                everything.modules[moduleDoc.name] = moduleDoc;
            }
        });

        return everything;
    };

    return exports;
})();

module.exports = confDoc;
