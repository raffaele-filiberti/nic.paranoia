'use strict';

var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    data = require('gulp-data'),
    fs = require('fs'),
    project = require('../../../project.json'),
    config = require('../config'),
    nunjucksRender = require('gulp-nunjucks-render');


var paths = project.env[config.envOpts.env];

gulp.task('html', function () {
    return gulp.src(config.nunjucksEntry + '**/*.+(html|nunjucks)')
        .pipe(data((file) => {
            return JSON.parse(fs.readFileSync(config.nunjucksEntry + 'data.json'));
        }))
        .pipe(nunjucksRender({
            path: [config.nunjucksEntry + 'templates'],
            envOptions: {
                autoescape: false
            }
        }))
        .pipe(gulp.dest(config.nunjucksDest))
        .pipe(browserSync.reload({stream: true}));
});
