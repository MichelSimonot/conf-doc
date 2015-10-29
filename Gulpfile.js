'use strict';
var gulp = require('gulp');
var confDoc = require('./conf-doc.js');

var files = [
    'test/testfile.js',
    'test/testfile2.js',
    'test/otherfile.js'
];

gulp.task('run', function() {

    var autodoc = confDoc.parse(files);
    console.log(JSON.stringify(autodoc));

});
