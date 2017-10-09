// Include gulp
var gulp = require('gulp');
// Include browserSync
var browserSync = require('browser-sync').create();

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');


// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src([
        'scss/*.scss'
    ])
        .pipe(sass())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/gsap/TweenMax.js',
        'node_modules/scrollmagic/scrollmagic/minified/ScrollMagic.min.js',
        'node_modules/scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js',
        'node_modules/scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min.js',
        'node_modules/gsap/ScrollToPlugin.js',
        'js/index.js'
        ])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/index.js', ['lint', 'scripts']);
    gulp.watch(
        [
            'scss/base/*.scss',
            'scss/components/*.scss',
            'scss/helpers/*.scss',
            'scss/layout/*.scss',
            'scss/pages/*.scss',
            'scss/themes/*.scss',
            'scss/vendor/*.scss',
            'scss/*.scss'
        ], ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

// Static Server + watching scss/html files
gulp.task('serve', ['lint', 'sass', 'scripts', 'watch'], function() {
    browserSync.init({
        server: "./"
    });
});

//default task
gulp.task('default', ['serve']);