const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const sass = require('gulp-sass');

gulp.task('package_js', () => {
    gulp.src(['static/js/util.js', 'static/js/utils/*.js'])
        .pipe(babel({
            presets: ['es2015'],
            // plugins: ['transform-runtime'],
        }))
        .pipe(concat('compressed.js'))
        .pipe(uglify())
        .pipe(gulp.dest('static/dist/js'));
});
gulp.task('compile_scss', () => {
    gulp.src('static/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('static/dist/css'));
});
gulp.watch('static/scss/*.scss', ['compile_scss']);

gulp.task('default', ['package_js', 'compile_scss'], () => {
    console.log('done');
});
