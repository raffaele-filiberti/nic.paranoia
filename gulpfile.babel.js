import gulp from 'gulp';
import babelify from 'babelify';
import browserSync from 'browser-sync';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import critical from 'critical';
// Include Plugins like sass, autoprefixer,
import plugins from 'gulp-load-plugins';
// Include file stream
import fs from 'fs';

/* ----------------- */
/* Development
/* ----------------- */

gulp.task('development', ['scripts', 'styles', 'nunjucks', 'watch'], () => {
    browserSync({
        'server': './',
        'snippetOptions': {
            'rule': {
                'match': /<\/body>/i,
                'fn': (snippet) => snippet
            }
        }
    });
});

/* ----------------- */
/* Production
/* ----------------- */

gulp.task('production', ['html', 'jsmin']);


/* ----------------- */
/* Scripts
/* ----------------- */

gulp.task('scripts', () => {
    return browserify({
        'entries': ['./js/main.js'],
        'debug': true,
        'transform': [
            babelify.configure({
                'presets': ['es2015']
            })
        ]
    })
        .bundle()
        .on('error', () => {
            let args = Array.prototype.slice.call(arguments);

            plugins().notify.onError({
                'title': 'Compile Error',
                'message': '<%= error.message %>'
            }).apply(this, args);

            this.emit('end');
        })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(plugins().sourcemaps.init({'loadMaps': true}))
        .pipe(plugins().sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(browserSync.stream());
});


/* ----------------- */
/* Styles
/* ----------------- */

gulp.task('styles', () => {
    return gulp.src('./scss/*.scss')
        .pipe(plugins().sourcemaps.init())
        .pipe(plugins().sass().on('error', plugins().sass.logError))
        .pipe(plugins().autoprefixer())
        .pipe(plugins().sourcemaps.write())
        .pipe(gulp.dest('./dist/css/'))
        .pipe(browserSync.stream());
});


/* ----------------- */
/* HTML
/* ----------------- */

gulp.task('html', ['cssmin'], () => {
    return gulp.src('*.html')
        .pipe(critical.stream({
            'base': './',
            'inline': true,
            'extract': true,
            'minify': true,
            'css': ['./dist/css/style.css']
        }))
        .pipe(gulp.dest('./dist'));
});

/* ----------------- */
/* Nunjucks
/* ----------------- */

gulp.task('nunjucks', ['styles'], () => {
    return gulp.src('app/pages/**/*.+(html|nunjucks)')
        .pipe(plugins().data((file) => {
            return JSON.parse(fs.readFileSync('./app/data.json'));
        }))
        .pipe(plugins().nunjucksRender({
            path: ['app/templates'],
            envOptions: {
                autoescape: false
            }
        }))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
});

/* ----------------- */
/* Cssmin
/* ----------------- */

gulp.task('cssmin', () => {
    return gulp.src('./scss/*.scss')
        .pipe(plugins().sass({
            'outputStyle': 'compressed'
        }).on('error', plugins().sass.logError))
        .pipe(gulp.dest('./dist/css/'));
});


/* ----------------- */
/* Jsmin
/* ----------------- */

gulp.task('jsmin', () => {
    let envs = plugins().env.set({
        'NODE_ENV': 'production'
    });

    return browserify({
        'entries': ['./js/main.js'],
        'debug': false,
        'transform': [
            babelify.configure({
                'presets': ['es2015']
            })
        ]
    })
        .bundle()
        .pipe(source('bundle.min.js'))
        .pipe(envs)
        .pipe(buffer())
        .pipe(plugins().uglify())
        .pipe(envs.reset)
        .pipe(gulp.dest('./dist/js/'));
});

/* ----------------- */
/* Watches
/* ----------------- */

gulp.task('watch', function () {

    gulp.watch(
        ['js/main.js'],
        ['scripts']
    );

    gulp.watch(
        ['scss/**/*.scss'],
        ['styles']
    );

    gulp.watch(
        ['app/**/**/*.+(html|nunjucks)', 'app/data.json'],
        ['nunjucks']
    );
});

/* ----------------- */
/* Taks
/* ----------------- */

gulp.task('default', ['development']);
gulp.task('deploy', ['production']);