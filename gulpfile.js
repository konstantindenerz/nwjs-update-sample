var gulp = require('gulp'),
  del = require('del'),
  path = require('path'),
  runSequence = require('run-sequence'),
  archiver = require('gulp-archiver')
  NwBuilder = require('nw-builder'),
  jsonTransform = require('gulp-json-transform'),
  semver = require('semver'),
  install = require('gulp-install'),
  argv = require('yargs').argv,
  fs = require('fs'),
  zip = require('gulp-vinyl-zip');


var paths = {
  nwjs: './nwjs',
  package: './package.json',
  initialVersion: './initial/',
  nwjsPackage: './nwjs/package.json',
  macZip: true,
  build: {
    folder: './nwjs/build/',
    mac: './nwjs/build/app/osx64/**/*',
    win: './nwjs/build/app/win64/**/*'
  },
  dist: {
    folder: './distribution',
    mac: './distribution/releases/app/mac/',
    win: './distribution/releases/app/win/'
  },
};

gulp.task('clean', function(done) {
  return del([
    paths.build.folder,
    paths.dist.mac,
    paths.dist.win
  ], done);
});

gulp.task('build', function(done){


  var nw = new NwBuilder({
      version: '0.12.3',
      files: path.join(paths.nwjs, '**','*.*'),
      buildDir: paths.build.folder,
      platforms: ['osx64', 'win64']
  });

  nw.on('log',  console.log);

  nw.build().then(function(data){
    done();
  }).catch(function (error) {
      console.error(error);
  });

});


gulp.task('publish:copy-package', function(){
  return gulp.src(paths.nwjsPackage)
        .pipe(gulp.dest(paths.dist.folder));
});

gulp.task('publish:archive-and-copy', function(done){
  runSequence(['publish:archive:mac', 'publish:archive:win'], done);
});


gulp.task('default', function(callback){

});


gulp.task('npm:install', function(){
  return gulp.src(paths.nwjsPackage)
  .pipe(install({
    args: ['--production']
  }))
});

gulp.task('publish:initial', function(){
  if(!fs.existsSync(paths.initialVersion)){
    return gulp.src(path.join(paths.build.folder,'**','*'))
    .pipe(gulp.dest(paths.initialVersion));
  }else {
    return gulp.src(paths.build.folder);
  }

});


gulp.task('increase-major-version', function(callback){
  return gulp.src(paths.package)
  .pipe(jsonTransform(function(data){
    var version = argv.version || 1;
    data.version = '0.0.0';
    for(var i=0;i<version;i++){
      data.version = semver.inc(data.version,'major');
    }
    return data;
  }))
  .pipe(gulp.dest(paths.nwjs));
});

gulp.task('publish:vnext', function(callback){
  runSequence('increase-major-version', 'clean','npm:install', 'build','publish:copy-package', 'publish:archive-and-copy', 'publish:initial', callback);
});


gulp.task('publish:archive:mac', function(){
  return gulp.src(paths.build.mac)
  .pipe(zip.dest(path.join(paths.dist.mac,'app.zip')));
});


gulp.task('publish:archive:win', function(){
  return gulp.src(paths.build.win)
  .pipe(zip.dest(path.join(paths.dist.win,'app.zip')));
});
