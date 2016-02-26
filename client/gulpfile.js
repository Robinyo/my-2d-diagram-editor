'use strict';

var config = require('./gulp-config.json');

var gulp = require('gulp');
var webserver = require('gulp-webserver');


gulp.task('hello', function() {
  console.log('Rob Ferguson');
});

gulp.task('webserver', function() {
  gulp.src( '.' )
    .pipe(webserver({
      host:             'localhost',
      port:             '8001',
      livereload:       false,
      directoryListing: false
    }));
});

/*

var browserSync = require('browser-sync').create();

// Static server
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

*/

