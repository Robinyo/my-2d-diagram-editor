'use strict';

var config = require('./gulp-config.json');

var gulp = require('gulp');
var browserSync = require('browser-sync').create();

// Static server
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('hello', function() {
  console.log('Rob Ferguson');
});
