const colors = require("ansi-colors"),
  envConfig = require("./config/gulp.env"),
  sass = require("gulp-sass")(require("sass")),
  sourcemaps = require('gulp-sourcemaps'),
  dependents = require('gulp-dependents');

/**
 * @param gulp
 * @param $
 * @param config
 */
module.exports = (gulp, $, config) => {
  function onError(err) {
    console.log(colors.red('[ERROR]'), err.message, colors.red('line:'), err.line, colors.red('column:'), err.column);
    this.emit('end');
  }

  function msass() {
    return gulp
      .src(config.mScss.src, { since: gulp.lastRun('msass') })
      .pipe(dependents())
      .pipe($.if(!envConfig.isProduction, sourcemaps.init()))
      .pipe(
        $.plumber({
          errorHandler: !envConfig.isProduction,
        })
      )
      .pipe(sass(config.scssOpt).on('error', onError))
      .pipe($.autoprefixer(config.browsers))
      .pipe($.if(!envConfig.isProduction, sourcemaps.write('./')))
      .pipe(gulp.dest(config.mScss.dest));
  }
  msass.description = 'Mobile SCSS compile후 css로 컴파일 및 소스맵 생성해서 dist로 복사';

  function pcsass() {
    return gulp
      .src(config.pcScss.src, { since: gulp.lastRun('pcsass') })
      .pipe(dependents())
      .pipe($.if(!envConfig.isProduction, sourcemaps.init()))
      .pipe(
        $.plumber({
          errorHandler: !envConfig.isProduction,
        })
      )
      .pipe(sass(config.scssOpt).on('error', onError))
      .pipe($.autoprefixer(config.browsers))
      .pipe($.if(!envConfig.isProduction, sourcemaps.write('./')))
      .pipe(gulp.dest(config.pcScss.dest));
  }
  pcsass.description = 'PC SCSS compile후 css로 컴파일 및 소스맵 생성해서 dist로 복사';

	gulp.task(msass);
	gulp.task(pcsass);

};
