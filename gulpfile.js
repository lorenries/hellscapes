var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var uncss 		= require('gulp-uncss');
var concat 		= require('gulp-concat');
var nano 		= require('gulp-cssnano');

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./src/"
        }
    });
    gulp.watch("assets/css/*.css", ['css'])
    gulp.watch("assets/js/*.js", browserSync.reload)
    gulp.watch("index.html", browserSync.reload)
    gulp.watch("v2/index.html", browserSync.reload)
});

gulp.task('css', function() {
    return gulp.src('src/assets/css/*.css')
        .pipe(concat('main.css'))
        .pipe(uncss({
            html: ['http://localhost:3000/']
        }))
        .pipe(nano({
            discardComments: {removeAll: true}
        }))
        .pipe(gulp.dest('src/assets/css/'));
});

gulp.task('build', function() {
  // copy any html files in source/ to public/
  	gulp.src('src/*.html').pipe(gulp.dest('dist'));
  	gulp.src('src/assets/js/bundle.js').pipe(gulp.dest('dist/assets/js'));
  	gulp.src('src/assets/css/main.css').pipe(gulp.dest('dist/assets/css'));
});