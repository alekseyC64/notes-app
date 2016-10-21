const gulp = require('gulp'),
      concat = require('gulp-concat'),
      gulpif = require('gulp-if'),
      inject = require('gulp-inject'),
      minifyCss = require('gulp-clean-css'),
      notify = require('gulp-notify'),
      templateCache = require('gulp-angular-templatecache'),
      uglify = require('gulp-uglify'),
      useref = require('gulp-useref'),
      karma = require('karma')

gulp.task('buildtemplates', function() {
  return gulp
    .src('./notes_app/client/**/*.tpl.html')
    .pipe(templateCache())
    .pipe(gulp.dest('./notes_app/dist'))
    .pipe(notify({
      'message': 'Templates packed into template cache'
    }))
})

gulp.task('build', ['buildtemplates'], function() {
  return gulp
    .src('./notes_app/client/index.html')
    .pipe(inject(gulp.src('./notes_app/dist/templates.js'), {
      name: 'templatecache',
      relative: true
    }))
    .pipe(useref())
    .pipe(gulpif('libs.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest('./notes_app/dist'))
    .pipe(notify({
      'message': 'Build complete',
      'onLast': true
    }))
})

gulp.task('default', ['build'])

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
