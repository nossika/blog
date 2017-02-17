const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const sass = require('gulp-sass');

gulp.task('package_js', () => {
    gulp.src(['src/util/main.js', 'src/util/sub/*.js'])
        .pipe(babel({
            presets: ['es2015'],
            // plugins: ['transform-runtime'],
        }))
        .pipe(concat('util_pack.js'))
        .pipe(uglify())
        .pipe(gulp.dest('static/js'));
});
gulp.task('compile_scss', () => {
    gulp.src('src/scss/*.scss')
        .pipe(sass({
            // outputStyle: 'compressed'
        }))
        .pipe(gulp.dest('static/css'));
});
gulp.watch('src/scss/*.scss', ['compile_scss']);
gulp.watch(['src/util/main.js', 'src/util/sub/*.js'], ['package_js']);

gulp.task('default', ['package_js', 'compile_scss'], () => {
    console.log('done');
});

process.on('uncaughtException', function(err) {
    console.log('uncaughtException: ' , err.stack);
});