const gulp         = require('gulp');
const browserSync  = require('browser-sync').create();
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat       = require('gulp-concat');
const imagemin     = require('gulp-imagemin');

// Compile Sass & Inject Into Browser
gulp.task('sass', function() {
    return gulp.src(['src/scss/*.scss'])
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});


// Copy ALL HTML files
gulp.task('copyHtml', function(){
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});

// concat scrips
gulp.task('vendorScripts', function() {
  gulp.src('src/js/vendor/*.js')
    .pipe(concat('vendorScripts.js'))
    .pipe(gulp.dest('dist/js'));
});
gulp.task('scripts', function() {
  gulp.src('src/js/scripts.js')
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('dist/js'));
});

// compress images
gulp.task('imageMin', () =>
	gulp.src('src/imgs/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/imgs'))
);


// Watch Sass & Serve
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: "./dist"  
    });

    gulp.watch(['src/scss/*.scss'], ['sass']);
    gulp.watch(['src/scss/*/*.scss'], ['sass']);
    gulp.watch(['src/*.html'], ['copyHtml']);
    
    gulp.watch("dist/css/*.css").on('change', browserSync.reload);
    gulp.watch("dist/*.html").on('change', browserSync.reload);
});

// Default Task
gulp.task('default', ['serve']);