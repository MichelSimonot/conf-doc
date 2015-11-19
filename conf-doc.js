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

            // If there was no module tag block, fix it.
            if(typeof moduleDoc.name === 'undefined') {
                var newDoc = {
                    name: path.basename(file),
                    type: 'module'
                };

                for(var key in moduleDoc) {
                    if(key !== 'undefined') {
                        newDoc[key] = moduleDoc[key];
                    }
                }
                moduleDoc = newDoc;
            }

            // TODO: Make this a stand-alone utility function.
            if(typeof everything.modules[moduleDoc.name] !== 'undefined') {

                // Merge extra functions into first functions.
                moduleDoc.function.forEach(function(func) {
                    // TODO: Check for duplicate function names (?).
                    everything.modules[moduleDoc.name].function.push(func);
                });

                // The only thing under module is function so far, so
                // don't need to merge anything else.

            } else {
                everything.modules[moduleDoc.name] = moduleDoc;
            }
        });

        return everything;
    };

    return exports;
})();

module.exports = confDoc;
