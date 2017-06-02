var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var uncss 		= require('gulp-uncss');
var concat 		= require('gulp-concat');
var nano 		= require('gulp-cssnano');
var browserify 	= require('browserify');
var source 		= require('vinyl-source-stream');
var uglify      = require('gulp-uglify');
var buffer      = require('vinyl-buffer');
var gutil       = require('gulp-util');
var babelify    = require('babelify');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('css', function() {
    return gulp.src('./src/assets/css/*.css')
        .pipe(concat('main.css'))
        .pipe(uncss({
            html: ['http://localhost:3000/']
        }))
        .pipe(nano({
            discardComments: {removeAll: true}
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))        
        .pipe(gulp.dest('./src/assets/css/'));
});

gulp.task('js', function() {

    return browserify('./src/assets/js/main.js')
        .transform("babelify", { presets: ["latest"] })
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('bundle.js'))
        .pipe(buffer())
        // Start piping stream to tasks!
        .pipe(uglify())
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(gulp.dest('./src/assets/js/'));
});

gulp.task('reload-js', ['js', 'css'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('serve', ['js'], function() {
    browserSync.init({
        server: {
            baseDir: "./src/"
        }
    });
    // gulp.watch("./src/assets/css/*.css", ['css'])
    gulp.watch("./src/assets/js/*.js", ['reload-js'])
    // gulp.watch("./src/index.html", browserSync.reload)
    // gulp.watch("v2/index.html", browserSync.reload)
});

gulp.task('build', function() {
  // copy any html files in source/ to public/
  	gulp.src('src/*.html').pipe(gulp.dest('dist'));
  	gulp.src('src/assets/js/bundle.js').pipe(gulp.dest('dist/assets/js'));
  	gulp.src('src/assets/css/main.css').pipe(gulp.dest('dist/assets/css'));
});