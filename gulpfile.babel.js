const 	gulp = require('gulp'),
	 	$ = require('gulp-load-plugins')({
				pattern: [
					'gulp-*',
					'gulp.*'
		    ],
		    scope: ['devDependencies']
		}),
		isProduction = require('./gulp/config/gulp.env'),
		gulpConfig = require('./gulp/config/gulp.config');

// if (isProduction) {
//   console.log('[env]: prod')
// } else {
//   console.log('[env]: dev')
// }

require('./gulp/cleanTask.js')(gulp, $, gulpConfig);
require('./gulp/htmlTask.js')(gulp, $, gulpConfig);
require('./gulp/sprTask.js')(gulp, $, gulpConfig);
require('./gulp/scssTask.js')(gulp, $, gulpConfig);
require('./gulp/svgTask.js')(gulp, $, gulpConfig);
require('./gulp/imgTask.js')(gulp, $, gulpConfig);
require('./gulp/lintTask.js')(gulp, $, gulpConfig);
require('./gulp/serverTask.js')(gulp, $, gulpConfig);
require('./gulp/purifyTask.js')(gulp, $, gulpConfig);
require('./gulp/copyImgTask.js')(gulp, $, gulpConfig);
require('./gulp/buildTask.js')(gulp, $, gulpConfig);
require('./gulp/reviewTask.js')(gulp, $, gulpConfig);

gulp.task('default' , gulp.series('clean', 'sprImgGenerate', 'mSvgSprite', 'pcSvgSprite', 'imgSprite', 'copyAllImages'))
