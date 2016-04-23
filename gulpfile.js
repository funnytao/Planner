// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: "./dist"
    });
});

gulp.task('sass', function () {
    gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('html', function() {
    gulp.src('./index.html')
        .pipe(concat('index.html'))
        .pipe(gulp.dest('dist'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']).on('change', browserSync.reload);
    gulp.watch('sass/*.scss', ['sass']).on('change', browserSync.reload);
    gulp.watch("*.html", ['html']).on('change', browserSync.reload);
});

// Default Task
gulp.task('default', ['lint', 'html', 'sass', 'scripts', 'watch', 'browser-sync']);