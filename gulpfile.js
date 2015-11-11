var gulp = require('gulp');


gulp.task('copy', function(){
  gulp.src('package.json')
  .pipe(gulp.dest('nwjs'));
});

gulp.task("build", function(){

  var NwBuilder = require('nw-builder');
  var nw = new NwBuilder({
      version: '0.12.3',
      files: './nwjs/**/*.*', // use the glob format
      buildDir: './nwjs/build/',
      platforms: ['osx64', 'win64']
  });

  //Log stuff you want

  nw.on('log',  console.log);

  // Build returns a promise
  nw.build().then(function () {
     console.log('all done!');
  }).catch(function (error) {
      console.error(error);
  });


});


gulp.task('default', ['copy','build']);
