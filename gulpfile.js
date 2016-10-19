const gulp = require('gulp'),
      concat = require('gulp-concat'),
      gulpif = require('gulp-if'),
      minifyCss = require('gulp-clean-css'),
      notify = require('gulp-notify'),
      uglify = require('gulp-uglify'),
      useref = require('gulp-useref'),
      karma = require('karma')

gulp.task('copytemplates', function() {
  return gulp
    .src('./notes_app/client/**/*.tpl.html')
    .pipe(gulp.dest('./notes_app/dist'))
    .pipe(notify({
      'message': 'Templates copied to dist',
      'onLast': true
    }))
})

gulp.task('build', function() {
  return gulp
    .src('./notes_app/client/index.html')
    .pipe(useref())
    .pipe(gulpif('libs.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest('./notes_app/dist'))
    .pipe(notify({
      'message': 'Build complete',
      'onLast': true
    }))
})

gulp.task('default', ['copytemplates', 'build'])

gulp.task('test', ['default'], function(done) {
  const s = new karma.Server({
    'configFile': __dirname + '/karma.conf.js',
    'singleRun': true
  }, done)
  s.start()
})

gulp.task('watch', ['default'], function() {
  gulp.watch('./notes_app/client/**/*.tpl.html', ['copytemplates'])
  gulp.watch('./notes_app/client/**/*.js', ['build'])
})
