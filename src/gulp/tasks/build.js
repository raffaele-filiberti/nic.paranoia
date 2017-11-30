'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minify = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    config = require('../config'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename');

gulp.task('build', ['clean', 'assets', 'vendors', 'html', 'scripts', 'styles'], function (cb) {

    if (config.envOpts.minify) {
        console.log(config.cssDest + 'global.css');

        gulp.src(config.jsDest + config.mainJS)
            .pipe(uglify())
            .pipe(gulp.dest(config.jsDest));

        return gulp.src(config.cssDest + 'global.css')
            .pipe(sourcemaps.init())
            .pipe(autoprefixer())
            .pipe(minify())
            .pipe(sourcemaps.write('./'))
            .pipe(rename('global.min.css'))
            .pipe(gulp.dest(config.cssDest));

    }

    cb();

});
