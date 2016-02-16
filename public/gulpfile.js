var gulp = require('gulp'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  source = require('vinyl-source-stream'),
  webserber = require('gulp-webserver');

gulp.task('browserify', function() {
  browserify('./src/app.jsx', {
    debug: true
  })
    .transform(babelify)
    .bundle()
    .on('error', function(err) {
      console.log('Error: ' + err.message);
    })
    .pipe(source('app.js'))
    .pipe(gulp.dest('./js'))
});

gulp.task('browserify_host', function() {
  browserify('./src/host.jsx', {
    debug: true
  })
    .transform(babelify)
    .bundle()
    .on('error', function(err) {
      console.log('Error: ' + err.message);
    })
    .pipe(source('host.js'))
    .pipe(gulp.dest('./js'))
});


gulp.task('watch', function() {
  gulp.watch('./src/*.jsx', ['browserify', 'browserify_host']);
});

// gulp.task('webserver', function() {
//   gulp.src('./')
//     .pipe(webserber({
//       livereload: true
//     }));
// });


gulp.task('default', ['browserify', 'browserify_host', 'watch']);
// gulp.task('browserify', function() {
//   var b = browserify({
//     entries: ['./src/app.js'],
//     transform: [reactify]
//   });
//   return b.bundle()
//     .pipe(source('app.js'))
//     .pipe(gulp.dest('./js'));
// });
