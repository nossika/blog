const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

gulp.task('min_js', () => {
    gulp.src('./static/js/*.js')
        .pipe(concat('compressed.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./static/js'));
});
gulp.task('default', ['min_js'], () => {
    console.log('success')
});
