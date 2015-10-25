'use strict';
var gulp = require('gulp');
var confDoc = require('./conf-doc.js');

var files = [
    '/testfile.js',
    '/otherfile.js'
];

gulp.task('run', function() {

    var autodoc = confDoc.parse(files);
    console.log(JSON.stringify(autodoc));

});
