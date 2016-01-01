var gulp = require('gulp'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  reactify = require('reactify');

gulp.task('browserify', function() {
  var b = browserify({
    entries: ['./src/app.js'],
    transform: [reactify]
  });
  return b.bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./js'));
});
