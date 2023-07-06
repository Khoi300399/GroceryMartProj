const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const pug = require("gulp-pug");
const browserSync = require("browser-sync").create();

// Biên dịch Sass thành CSS
gulp.task("sass", function () {
  return gulp
    .src("./app/**/scss/*.scss")
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(rename("style.css"))
    .pipe(cssnano())
    .pipe(gulp.dest("./app/public/css/"));
});

// Biên dịch Pug thành HTML
gulp.task("pug", function () {
  return gulp
    .src("./app/src/views/*.pug", { sourcemaps: true })
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest("./app/public/"));
});

// Tạo máy chủ phát triển cục bộ và tự động làm mới trình duyệt
gulp.task("serve", function () {
  browserSync.init({
    server: {
      baseDir: "./app/public",
    },
  });
  gulp
    .watch("./app/src/views/**/*.pug", gulp.parallel("pug"))
    .on("change", browserSync.reload);
  gulp.watch("./app/src/**/*.scss", gulp.parallel("sass"));
});

// Tác vụ xây dựng chính
gulp.task("build", gulp.series("sass", "pug"));

// Tác vụ mặc định
gulp.task("default", gulp.series("build", "serve"));
