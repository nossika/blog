const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const less = require('gulp-less');

gulp.task('package_js', () => {
    gulp.src(['static/js/util.js', 'static/js/utils/*.js'])
        .pipe(babel({
            presets: ['es2015'],
            // plugins: ['transform-runtime'],
        }))
        .pipe(concat('compressed.js'))
        .pipe(uglify())
        .pipe(gulp.dest('static/build'))
});

gulp.task('default', ['package_js'], () => {
    console.log('done');
});
