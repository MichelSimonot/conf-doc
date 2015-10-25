'use strict';
var gulp = require('gulp');
var readSync = require('read-file-relative').readSync;

var parser = require('./parser.js');
var data = readSync('/testfile.js');

gulp.task('run', function() {

    var autodoc = parser.parse(data);
    console.log(JSON.stringify(autodoc));

});
