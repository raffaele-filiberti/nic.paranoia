// Include gulp
var gulp = require('gulp');

// Include browserSync
var browserSync = require('browser-sync').create();

// Include Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var data = require('gulp-data');
var fs = require('fs');

// Template Engine
var nunjucksRender = require('gulp-nunjucks-render');

// Lint Task
gulp.task('lint', function () {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function () {
    return gulp.src([
        'scss/*.scss'
    ])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

// Concatenate & Minify JS
gulp.task('init', function () {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/gsap/TweenMax.js',
        'node_modules/scrollmagic/scrollmagic/minified/ScrollMagic.min.js',
        'node_modules/scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js',
        'node_modules/scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min.js',
        'node_modules/gsap/ScrollToPlugin.js',
        'libs/imagesLoaded.pkgd.min.js',
        'libs/isotope.pkgd.min.js',
        'libs/sly.min.js',
    ])
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

gulp.task('nunjucks', function () {
    // Gets .html and .nunjucks files in pages
    return gulp.src('app/pages/**/*.+(html|nunjucks)')
    // Adding data to Nunjucks
        .pipe(data(function(file) {
            return JSON.parse(fs.readFileSync('./app/data.json'));
        }))
        // Renders template with nunjucks
        .pipe(nunjucksRender({
            path: ['app/templates'],
            envOptions: {
                autoescape: false
            }
        }))
        // output files in app folder
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function () {
    return gulp.src([
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
// Added icolors folder
gulp.task('watch', function () {

    gulp.watch(
        [
            'js/index.js'
        ],
        [
            'lint',
            'scripts'
        ]
    );

    gulp.watch(
        [
            'scss/**/*.scss'
        ],
        [
            'sass'
        ]
    );

    gulp.watch(
        [
            'app/**/**/*.+(html|nunjucks)',
            'app/data.json'
        ],
        [
            'nunjucks'
        ]
    )
}).on('end', browserSync.reload);

// Static Server + watching scss/html files
gulp.task('serve', ['lint', 'init', 'sass', 'scripts', 'nunjucks', 'watch'], function () {
    browserSync.init({
        server: "./"
    });
});

//default task
gulp.task('default', ['serve']);