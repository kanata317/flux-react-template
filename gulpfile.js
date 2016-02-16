var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task('babel', function() {
  gulp.src('./*.es6')
    .pipe(babel())
    .pipe(gulp.dest('./'))
});

gulp.task('babel_models', function() {
  gulp.src('./models/*.es6')
    .pipe(babel())
    .pipe(gulp.dest('./models'))
});


gulp.task('watch', function() {
  gulp.watch('./*.es6', ['babel', 'babel_models'])
});

gulp.task('models_watch', function() {
  gulp.watch('./models/*.es6', ['babel_models'])
});


gulp.task('default', ['babel', 'watch', 'babel_models', 'models_watch']);
