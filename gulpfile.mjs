import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as sass from 'sass';
import cssnano from 'gulp-cssnano';
import rename from 'gulp-rename';
import autoprefixer from 'gulp-autoprefixer';
import pug from 'gulp-pug';
import plumber from 'gulp-plumber';
import browserSyncLib from 'browser-sync';

// Giải nén các thuộc tính từ đối tượng gulp
const { src, task, series, parallel, dest, watch } = gulp;

// Tạo instance của browserSync
const browserSync = browserSyncLib.create();

// Cấu hình gulp-sass với trình biên dịch sass
const sassCompiler = gulpSass(sass);

// Biên dịch Sass thành CSS
task('sassTask', function () {
  return src('./app/**/sass/*.sass', { sourcemaps: true })
    .pipe(
      plumber(function (err) {
        console.log('Sass Task Error');
        console.log(err);
        this.emit('end');
      })
    )
    .pipe(sassCompiler())
    .pipe(autoprefixer())
    .pipe(rename('style.css'))
    .pipe(cssnano())
    .pipe(dest('./app/public/css/', { sourcemaps: '.' }))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

// Biên dịch Pug thành HTML
task('pugTask', function () {
  return src('./app/src/views/*.pug')
    .pipe(
      plumber(function (err) {
        console.log('Pug Task Error');
        console.log(err);
        this.emit('end');
      })
    )
    .pipe(pug({ pretty: true }))
    .pipe(dest('./app/public/'))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

// Clone file image
task('imageTask', function () {
  return src('./app/src/assets/images/*')
    .pipe(dest('./app/public/images'))
    .pipe(
      plumber(function (err) {
        console.log('Image Task Error');
        console.log(err);
        this.emit('end');
      })
    );
});

// Tạo máy chủ phát triển cục bộ và tự động làm mới trình duyệt
task('browserSyncTask', function (done) {
  browserSync.init({
    server: {
      baseDir: './app/public',
    },
    port: 3000,
  });
  done();
});

function watching() {
  watch('./app/src/views/**/*.pug', series('pugTask')).on('change', browserSync.reload);
  watch('./app/src/**/*.scss', series('sassTask')).on('change', browserSync.reload);
  watch('./app/src/assets/images/*', series('imageTask')).on('change', browserSync.reload);
}

// Tác vụ xây dựng chính
task('build', parallel('pugTask', 'sassTask', 'imageTask'));

// Tác vụ mặc định
task('default', series('build', parallel(watching, 'browserSyncTask')));
