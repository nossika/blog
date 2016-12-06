const gulp = require('gulp');
// const uglify = require('gulp-uglify');
// const concat = require('gulp-concat');
const babel = require('gulp-babel');
const less = require('gulp-less');

gulp.task('min_js', () => {
    // gulp.src('./static/js/*.js')
    //     .pipe(concat('compressed.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest('./ddd'));
    gulp.src('./static/js/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./ddd'));
});
gulp.task('default', ['min_js'], () => {
    console.log('success')
});
