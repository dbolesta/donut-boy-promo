const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");

// Compile Sass & Inject Into Browser
gulp.task("sass", function() {
  return gulp
    .src(["src/scss/*.scss"])
    .pipe(sass())
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
});

// Copy ALL HTML files
gulp.task("copyHtml", function() {
  gulp.src("src/*.html").pipe(gulp.dest("dist"));
});

// concat scrips
gulp.task("vendorScripts", function() {
  gulp
    .src("src/js/vendor/*.js")
    .pipe(concat("vendorScripts.js"))
    .pipe(gulp.dest("dist/js"));
});
gulp.task("pluginScripts", function() {
  gulp
    .src("src/js/plugins/*.js")
    .pipe(concat("pluginScripts.js"))
    .pipe(gulp.dest("dist/js"));
});
gulp.task("scripts", function() {
  gulp
    .src("src/js/*.js")
    .pipe(concat("scripts.js"))
    .pipe(gulp.dest("dist/js"));
});

// compress images
gulp.task("imageMin", () =>
  gulp
    .src("src/imgs/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/imgs"))
);

// Copy audio files
gulp.task("copyAudio", function() {
  gulp.src("src/audio/*").pipe(gulp.dest("dist/audio"));
});

// Watch Sass & Serve
gulp.task(
  "serve",
  gulp.series("sass", function() {
    browserSync.init({
      server: "./dist"
    });

    gulp.watch(["src/scss/*.scss"], gulp.series("sass"));
    gulp.watch(["src/scss/*/*.scss"], gulp.series("sass"));
    gulp.watch(["src/*.html"], gulp.series("copyHtml"));
    gulp.watch(["src/js/*.js"], gulp.series("scripts"));
    gulp.watch(["src/js/plugins/*.js"], gulp.series("pluginScripts"));
    gulp.watch(["src/imgs/*"], gulp.series("imageMin"));

    gulp.watch("dist/css/*.css").on("change", browserSync.reload);
    gulp.watch("dist/js/*.js").on("change", browserSync.reload);
    gulp.watch("dist/*.html").on("change", browserSync.reload);
    gulp.watch("dist/imgs/*").on("change", browserSync.reload);
  })
);

// Default Task
gulp.task("default", gulp.series("serve"));
