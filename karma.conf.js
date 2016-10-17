// Karma configuration
// Generated on Thu Sep 29 2016 14:40:32 GMT+0300 (MSK)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      // libraries
      'node_modules/angular/angular.js',
      'node_modules/angular-sanitize/angular-sanitize.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/ui-select/dist/select.js',
      'node_modules/angular-ui-router/release/angular-ui-router.js',
      'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
      'node_modules/angular-ui-grid/ui-grid.js',
      // app
      'notes_app/client/notes.js',
      'notes_app/client/app/**/*.js',
      // templates
      '**/*.tpl.html',
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'notes_app/client/templates/*.tpl.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      moduleName: 'test.templates',
      stripPrefix: 'notes_app/client/'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
