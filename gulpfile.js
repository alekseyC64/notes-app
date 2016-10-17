const gulp = require('gulp'),
    karma = require('karma')

const scripts = [
  'node_modules/angular/angular.js',
  'node_modules/angular-sanitize/angular-sanitize.js',
  'node_modules/angular-ui-router/release/angular-ui-router.js',
  'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
  'node_modules/ui-select/dist/select.js',
  'node_modules/angular-ui-grid/ui-grid.js'
]

const styles = [
  'node_modules/bootstrap-css-only/css/bootstrap.css',
  'node_modules/bootstrap-css-only/css/bootstrap-theme.css',
  'node_modules/ui-select/dist/select.css',
  'node_modules/angular-ui-grid/ui-grid.css'
]

gulp.task('scripts', function() {
  gulp.src(scripts).pipe(gulp.dest('notes_app/client/scripts/'))
})

gulp.task('styles', function() {
  gulp.src(styles).pipe(gulp.dest('notes_app/client/styles/'))
})

gulp.task('default', ['scripts', 'styles'])

gulp.task('test', ['default'], function(done) {
  const s = new karma.Server({
    'configFile': __dirname + '/karma.conf.js',
    'singleRun': true
  }, done)
  s.start()
})
