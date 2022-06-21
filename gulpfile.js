const {src, dest, watch, parallel, series} = require('gulp');
const pug = require('gulp-pug');
const scss = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const pugBem = require('gulp-pugbem');


/*------ HTML / PUG ---------*/

function views() {
    return src('src/views/pages/*.pug')
        .pipe(plumber())
        .pipe(pug({
            pretty: '\t',
            plugins: [pugBem],
        }))
        .pipe(dest('src/'))
        .pipe(browserSync.stream())
}

/*------ CSS / SCSS ---------*/

function styles() {
    return src('src/styles/style.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(autoprefixer({
            grid: 'autoplace'
        }))
        .pipe(concat('style.min.css'))
        .pipe(sourcemaps.write('/'))
        .pipe(dest('src/styles'))
        .pipe(browserSync.stream())
}

/*------ JS ---------*/

function scriptsVendor() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/lazysizes/lazysizes.js',
        //'src/scripts/vendor/jquery.visible.min.js',
        'node_modules/swiper/swiper-bundle.min.js',
        'node_modules/imask/dist/imask.js',
        'src/scripts/vendor/jquery.fancybox.js',
        //'src/scripts/vendor/datepicker.min.js',
        //'node_modules/easy-autocomplete/dist/jquery.easy-autocomplete.js',
    ])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('vendor.min.js'))
        .pipe(uglify({
            output: {
                comments: false
            },
        }))
        .pipe(sourcemaps.write('/'))
        .pipe(dest('src/scripts'))
        .pipe(browserSync.stream())
}

function scripts() {
    return src('src/scripts/main.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('main.min.js'))
        .pipe(uglify({
            output: {
                comments: false
            },
        }))
        .pipe(sourcemaps.write('/'))
        .pipe(dest('src/scripts'))
        .pipe(browserSync.stream())
}

/*------ IMAGES / SVG ---------*/

function toWebp() {
    return src('src/img/*.{png,jpg,jpeg}')
        .pipe(webp())
        .pipe(dest('dist/img'))
}

function devToWebp() {
    return src('src/img/*.{png,jpg,jpeg}')
        .pipe(webp())
        .pipe(dest('src/img'))
        .pipe(browserSync.stream())
}

function sprite() {
    return src(['src/img/svg/*.svg'])
        .pipe(imagemin([
            imagemin.svgo({
                plugins: [
                    { removeViewBox: false },
                    { removeUselessDefs: false },
                    { cleanupIDs: false },
                    { removeUselessStrokeAndFill: false },
                ]
            })
        ]))
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(concat('sprite.svg'))
        .pipe(dest('dist/img/svg'));
}

function devSprite() {
    return src(['src/img/svg/*.svg'])
        .pipe(imagemin([
            imagemin.svgo({
                plugins: [
                    { removeViewBox: false },
                    { removeUselessDefs: false },
                    { cleanupIDs: false },
                    { removeUselessStrokeAndFill: false },
                ]
            })
        ]))
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(concat('sprite.svg'))
        .pipe(dest('src/img/svg'))
        .pipe(browserSync.stream())
}

function images() {
    return src('src/img/**/*.{png,jpg,jpeg}')
        .pipe(imagemin([
            imagemin.mozjpeg(),
            imagemin.optipng(),
        ] , {
            verbose: true
        }))
        .pipe(dest('dist/img'))
}

function cleanSprite() {
    return del('src/img/svg/sprite.svg')
}

/*------ DEV ---------*/

function watcher() {
    watch(['src/views/**/*.pug'], views);
    watch(['src/styles/**/*.scss'], styles);
    watch(['src/scripts/main.js'], scripts);
    watch(['src/img/*.{png,jpg,jpeg}'], devToWebp);
    watch(['src/img/svg/*.svg', '!src/img/svg/sprite.svg'], series(cleanSprite, devSprite));
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir : 'src/'
        }
    });
}

/*------ BUILD ---------*/

function cleandist() {
    return del(['dist'])
}
function cleandisteximg() {
    return del(['dist/**', '!dist/img'])
}

function copytodist () {
    return src([
        'src/**/*.html',
        'src/styles/style.min.css',
        'src/styles/style.min.css.map',
        'src/scripts/vendor.min.js',
        'src/scripts/vendor.min.js.map',
        'src/scripts/main.min.js',
        'src/scripts/main.min.js.map',
        'src/scripts/vendor/uhpv-full.min.js',
        'src/fonts/**/*',
        'src/img/svg/**/*.svg',
        '!src/img/svg/**/sprite.svg',
        'src/img/*.ico',
        'src/video/**/*',
        'src/data/**/*',
    ], {base: 'src'})
        .pipe(dest('dist'))
}

exports.dev = parallel(views, styles, scriptsVendor, scripts, browsersync, watcher)
exports.build = series(cleandist, parallel(views, styles, scriptsVendor, scripts), images, toWebp, sprite, copytodist)
exports.buildnoimg = series(cleandisteximg, parallel(views, styles, scriptsVendor, scripts), sprite, copytodist)
