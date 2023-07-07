const { src, task, series, parallel, dest, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const pug = require("gulp-pug");
const plumber = require("gulp-plumber");
const browserSync = require("browser-sync").create();

// Biên dịch Sass thành CSS
task("sassTask", function () {
  return src("./app/**/scss/*.scss", { sourcemaps: true })
    .pipe(
      plumber(function (err) {
        console.log("Sass Task Error");
        console.log(err);
        this.emit("end");
      })
    )
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(rename("style.css"))
    .pipe(cssnano())
    .pipe(dest("./app/public/css/"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

// Biên dịch Pug thành HTML
task("pugTask", function () {
  return src("./app/src/views/*.pug")
    .pipe(
      plumber(function (err) {
        console.log("Pug Task Error");
        console.log(err);
        this.emit("end");
      })
    )
    .pipe(pug({ pretty: true }))
    .pipe(dest("./app/public/"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

// Clone file image
task("imageTask", function () {
  return src("./app/src/assets/images/*")
    .pipe(dest("./app/public/images"))
    .pipe(
      plumber(function (err) {
        console.log("Image Task Error");
        console.log(err);
        this.emit("end");
      })
    );
});

// Tạo máy chủ phát triển cục bộ và tự động làm mới trình duyệt
task("browserSyncTask", function (done) {
  browserSync.init({
    server: {
      baseDir: "./app/public",
    },
    port: 3000,
  });
  done();
});

function watching() {
  watch("./app/src/views/**/*.pug", series("pugTask")).on(
    "change",
    browserSync.reload
  );
  watch("./app/src/**/*.scss", series("sassTask")).on(
    "change",
    browserSync.reload
  );
  watch("./app/src/assets/images/*", series("imageTask")).on(
    "change",
    browserSync.reload
  );
}

// Tác vụ xây dựng chính
task("build", parallel("pugTask", "sassTask", "imageTask"));

// Tác vụ mặc định
task("default", series("build", parallel(watching, "browserSyncTask")));
