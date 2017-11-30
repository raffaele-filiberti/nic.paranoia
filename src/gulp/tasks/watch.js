'use strict';

var gulp = require('gulp'),
    watch = require('watchify'),
    project = require('../../../project.json'),
    config = require('../config');

gulp.task('watch', function () {

    gulp.watch(config.cssEntry + "**/*.scss", ['styles']);
    gulp.watch(config.nunjucksEntry + "pages/**/*.+(html|nunjucks)", ['html']);
    gulp.watch(config.imageEntry + "*", ['assets']);

});