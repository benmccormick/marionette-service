var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var fs = require('fs');
var del = require('del');
var glob = require('glob');
var path = require('path');
var mkdirp = require('mkdirp');
var isparta = require('isparta');
var browserify = require('browserify');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');

var manifest = require('./package.json');
var config = manifest.libraryOptions;
var mainFile = manifest.main;
var destinationFolder = path.dirname(mainFile);
var exportFileName = path.basename(mainFile, path.extname(mainFile));

// Remove the built files
gulp.task('clean', function(cb) {
  del([destinationFolder], cb);
});

// Remove our temporary files
gulp.task('clean-tmp', function(cb) {
  del(['tmp'], cb);
});

// Send a notification when JSHint fails,
// so that you know your changes didn't build
function jshintNotify(file) {
  if (!file.jshint) { return; }
  return file.jshint.success ? false : 'JSHint failed';
}

function jscsNotify(file) {
  if (!file.jscs) { return; }
  return file.jscs.success ? false : 'JSRC failed';
}

function createLintTask(taskName, files) {
  gulp.task(taskName, function() {
    return gulp.src(files)
      .pipe($.plumber())
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'))
      .pipe($.notify(jshintNotify))
      .pipe($.jscs())
      .pipe($.notify(jscsNotify))
      .pipe($.jshint.reporter('fail'));
  });
}

// Lint our source code
createLintTask('lint-src', ['src/**/*.js']);

// Lint our test code
createLintTask('lint-test', ['test/**/*.js']);

function getBanner(){
return /**
 * Marionette Service
 *
 * Adds a Service Object to Marionette which allows an Object to
 * receive Backbone.Radio messages in a declarative fashion.
 *
 * @author Ben McCormick
 *
 */

}

// Build two versions of the library
gulp.task('build', ['lint-src', 'clean'], function(done) {

  var banner = ['/**',
    ' * Marionette Service',
    ' *',
    ' * Adds a Service Object to Marionette which allows an Object to',
    ' * receive Backbone.Radio messages in a declarative fashion.',
    ' *',
    ' * @author Ben McCormick',
    ' *',
    ' */',
    ''].join('\n');
    gulp.src(['src/' + config.entryFileName + '.js'])
      .pipe($.plumber())
      .pipe($.header(banner))
      .pipe(gulp.dest(destinationFolder))
      .pipe($.rename(exportFileName + '.min.js'))
      .pipe($.uglifyjs({
        outSourceMap: true,
      }))
      .pipe($.header(banner))
      .pipe(gulp.dest(destinationFolder))
      .on('end', done);
});

// Bundle our app for our unit tests
gulp.task('browserify', function() {
  var testFiles = glob.sync('./test/unit/**/*');
  var allFiles = ['./test/setup/browserify.js'].concat(testFiles);
  var bundler = browserify(allFiles);
  var bundleStream = bundler.bundle();
  return bundleStream
    .on('error', function(err){
      console.log(err.message);
      this.emit('end');
    })
    .pipe($.plumber())
    .pipe(source('./tmp/__spec-build.js'))
    .pipe(gulp.dest(''))
    .pipe($.livereload());
});

gulp.task('coverage', ['lint-src', 'lint-test'], function(done) {
  gulp.src(['src/*.js'])
    .pipe($.istanbul({ instrumenter: isparta.Instrumenter }))
    .pipe($.istanbul.hookRequire())
    .on('finish', function() {
      return test()
      .pipe($.istanbul.writeReports())
      .on('end', done);
    });
});

function test() {
  return gulp.src(['test/setup/node.js', 'test/unit/**/*.js'], {read: false})
    .pipe($.mocha({reporter: 'dot', globals: config.mochaGlobals}));
};

// Lint and run our tests
// gulp.task('test', ['lint-src', 'lint-test'], function() {
//   return test();
// });
gulp.task('test' , function() {
  return test();
});

// Ensure that linting occurs before browserify runs. This prevents
// the build from breaking due to poorly formatted code.
gulp.task('build-in-sequence', function(callback) {
  runSequence(['lint-src', 'lint-test'], 'browserify', callback);
});

const watchFiles = ['src/**/*', 'test/**/*', 'package.json', '**/.jshintrc', '.jscsrc'];

// Run the headless unit tests as you make changes.
gulp.task('watch', function() {
  gulp.watch(watchFiles, ['test']);
});

// Set up a livereload environment for our spec runner
gulp.task('test-browser', ['build-in-sequence'], function() {
  $.livereload.listen({port: 35729, host: 'localhost', start: true});
  return gulp.watch(watchFiles, ['build-in-sequence']);
});

// An alias of test
gulp.task('default', ['test']);
