var gulp = require('gulp'),
  del = require('del'),
  sass = require('gulp-sass'),
  cp = require('child_process'),
  nano = require('gulp-cssnano'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  plumber = require('gulp-plumber'),
  notify = require('gulp-notify'),
  deploy = require('gulp-gh-pages'),
  imagemin = require('gulp-imagemin'),
  prefix = require('gulp-autoprefixer'),
  browserSync = require('browser-sync'),
  jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll',
  messages = { jekyllBuild: '<span style="color: white">Running:</span> jekyll build' };

//Clean dist folder before each build
gulp.task('clean', function() {
  return del([
    'css/main.min.css',
    'js/app.min.js',
    '_site/images'
  ]);
});

// Build the Jekyll Site
gulp.task('jekyll-build', ['scss', 'js', 'images'], function(done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn(jekyll, ['build'], { stdio: 'inherit' })
    .on('close', done);
});

//Rebuild Jekyll & do page reload
gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
  browserSync.reload();
});

//Wait for jekyll-build, then launch the Server
gulp.task('browser-sync', ['jekyll-build'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    },
    host: "localhost"
  });
});

//throw error if scss breaks
gulp.task('scss', function() {
  var onError = function(err) {
    notify.onError({
      title: "Gulp",
      subtitle: "Scss Error!",
      message: "Error: <%= error.message %>",
      sound: "Beep"
    })(err);

    this.emit('end');
  };
  return gulp.src('_scss/main.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass({ includePaths: ['scss'] }))
    .pipe(prefix(['last 15 versions', '> 1%'], { cascade: true }))
    .pipe(gulp.dest('css'))
    .pipe(nano())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({ stream: true }));
});

//concat & uglify JS files
gulp.task('js', function() {
  return gulp.src('js/*.js')
    .pipe(concat('app.js'))
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'));
});

//images
gulp.task('images', function() {
  return gulp.src('images/*')
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest('_site/images'));
});

gulp.task('deploy', ['jekyll-build'], function() {
  return gulp.src("./_site/**/*")
    .pipe(deploy());
});

//Watch scss files for changes & recompile
//Watch html/md files, run jekyll & reload BrowserSync
gulp.task('watch', ['scss'], function() {
  gulp.watch('_scss/**/*.scss', ['scss', 'jekyll-rebuild']);
  gulp.watch(['*.html', '_layouts/*.html', '_posts/*', 'jekyll-rebuild']);
  gulp.watch('js/*.js', ['js', 'jekyll-rebuild']);
  gulp.watch('images/*', ['images', 'jekyll-rebuild']);
});

//Default task, running just `gulp` will compile the sass,
//compile the jekyll site, launch BrowserSync & watch files.
gulp.task('default', ['clean'], function() {
  gulp.start('scss', 'js', 'images', 'browser-sync', 'watch');
});
