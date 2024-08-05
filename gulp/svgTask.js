const 	log = require('fancy-log'),
		colors = require('ansi-colors'),
		glob = require('glob'),
		path = require('path'),
		del = require('del'),
		envConfig = require('./config/gulp.env'),
		FileCache = require("gulp-file-cache"),
		svgmin = require('gulp-svgmin'),
		svgSprite = require('gulp-svg-sprite');

/**
 * @param gulp
 * @param $
 * @param config
 */
module.exports = (gulp, $, config) => {

	const onError = (err) => {
		if (err) {
			let exitCode = 1;
			console.log(colors.red('[ERROR]'), 'gulp build task failed', err);
			console.log(colors.red('[FAIL]'), 'gulp build task failed - exiting with code ' + exitCode);
			return process.exit(exitCode);
		}
		//throw new Error(colors.green("info") + '::' + err);
	};

	const now = Number(new Date()),
				fileCache = new FileCache();
	// mobile
	function mBuildsvgFront() {

		function svgOpt(dirPath) {
			return {
				shape: {
					spacing: {
						padding:2,
						box: 'content'
					},
					transform :[
						shapeTransform,
						'svgo',
					]
				},
				mode: {
					css: {
						bust: false,
						dest: '.',
						prefix: '%s',
						sprite: 'dist/m/css/vendorsSvg/' + path.basename(dirPath) + '.svg',
						render: {
							scss: {
								template: './gulp/helper/svgsprite-scss-tmpl.mustache',
								dest: 'src/m/resources/sass/vendorsSvg/_' + path.basename(dirPath) + '.scss',
							}
						},
						example: {
							template: './gulp/helper/svg-guide-tmpl.html',
							dest: './src/m/svg-guide/' + path.basename(dirPath) + '.html'
						}
					}
				},
				svg:{
					namespaceClassnames:false,
					transform       : [
						/**
						 * Custom sprite SVG transformation
						 *
						 * @param {String} svg					Sprite SVG
						 * @return {String}						Processed SVG
						 */
						function(svg) {
							if(svg.match('keyframes')) {
								svg=svg.replace(/<script>/, '<style>').replace(/<\/script>/, '<\/style>');
							}
							return svg;
						},
					]
				},
				//scss에서 사용하는 코드
				variables: {
					svgcode: function() {
						return function(svg,render) {
							svg=render(svg).replace(/<svg[^>]*>|<\/svg>/gi,'').replace(/%/g,'%25').replace(/#/g,'%23');
							if(svg.match('keyframes')){
								svg=svg.replace(/<script>/, '<style>').replace(/<\/script>/, '<\/style>');
							}
							return svg;
						}
					},
					time: now
				}
			}
		}

		return glob('src/m/resources/images/svg/**/', function(err, dirs) {
			dirs.forEach(function(dir) {
				gulp.src(path.join(dir, '*.svg'),{base:dir})
					.pipe(fileCache.filter())
					.pipe($.plumber({
						errorHandler: envConfig.isProduction ? false : true
					}))
					.pipe(svgmin())
					.pipe(svgSprite(svgOpt(dir)))
					.pipe(fileCache.cache())
					.pipe(gulp.dest('.'));
			})
		});

	}
	mBuildsvgFront.description = 'Mobile SVG file 들로 자동 SVG SPRITE 파일과 SCSS파일을 생성후 컴파일합니다.'
	function shapeTransform(shape, spriter, callback) {
		svg=shape.getSVG();
		if(svg.match('keyframes')){
			svg=svg.replace(/<style[^>]*>/, '<script>').replace(/<\/style>/, '<\/script>');
			shape.setSVG(svg);
		}
		callback(null);
	}
	function mSvgcleanFront() {
		return del(config.mSvgFront.clean)
	}
	mSvgcleanFront.description = 'Mobile svg sprite 이미지파일과 관련SCSS 파일을 제거합니다.'
	function mSvgGuideCleanFront() {
		return del('./src/m/svg-guide/front')
	}
	mSvgGuideCleanFront.description = 'Mobile svg sprite guide관련 폴더와 파일을 제거합니다.'

	function shapeTransform(shape, spriter, callback) {
		svg=shape.getSVG();
		if(svg.match('keyframes')){
			svg=svg.replace(/<style[^>]*>/, '<script>').replace(/<\/style>/, '<\/script>');
			shape.setSVG(svg);
		}
		callback(null);
	}
	// PC
	function pcBuildsvgFront() {

		function svgOpt(dirPath) {
			return {
				shape: {
					spacing: {
						padding:2,
						box: 'content'
					},
					transform :[
						shapeTransform,
						'svgo',
					]
				},
				mode: {
					css: {
						bust: false,
						dest: '.',
						prefix: '%s',
						sprite: 'dist/pc/css/vendorsSvg/front/' + path.basename(dirPath) + '.svg',
						render: {
							scss: {
								template: './gulp/helper/svgsprite-scss-tmpl.mustache',
								dest: 'src/pc/resources/sass/front/vendorsSvg/_' + path.basename(dirPath) + '.scss',
							}
						},
						example: {
							template: './gulp/helper/svg-guide-tmpl.html',
							dest: './src/pc/svg-guide/front/' + path.basename(dirPath) + '.html'
						}
					}
				},
				svg:{
					namespaceClassnames:false,
					transform       : [
						/**
						 * Custom sprite SVG transformation
						 *
						 * @param {String} svg					Sprite SVG
						 * @return {String}						Processed SVG
						 */
						function(svg) {
							if(svg.match('keyframes')) {
								svg=svg.replace(/<script>/, '<style>').replace(/<\/script>/, '<\/style>');
							}
							return svg;
						},
					]
				},
				//scss에서 사용하는 코드
				variables: {
					svgcode: function() {
						return function(svg,render) {
							svg=render(svg).replace(/<svg[^>]*>|<\/svg>/gi,'').replace(/%/g,'%25').replace(/#/g,'%23');
							if(svg.match('keyframes')){
								svg=svg.replace(/<script>/, '<style>').replace(/<\/script>/, '<\/style>');
							}
							return svg;
						}
					},
					time: now
				}
			}
		}

		return glob('src/pc/resources/images/front/svg/**/', function(err, dirs) {
			dirs.forEach(function(dir) {
				gulp.src(path.join(dir, '*.svg'),{base:dir})
					.pipe(fileCache.filter())
					.pipe($.plumber({
						errorHandler: envConfig.isProduction ? false : true
					}))
					.pipe(svgmin())
					.pipe(svgSprite(svgOpt(dir)))
					.pipe(fileCache.cache())
					.pipe(gulp.dest('.'));
			})
		});

	}
	pcBuildsvgFront.description = 'Mobile SVG file 들로 자동 SVG SPRITE 파일과 SCSS파일을 생성후 컴파일합니다.'
	function shapeTransform(shape, spriter, callback) {
		svg=shape.getSVG();
		if(svg.match('keyframes')){
			svg=svg.replace(/<style[^>]*>/, '<script>').replace(/<\/style>/, '<\/script>');
			shape.setSVG(svg);
		}
		callback(null);
	}
	function pcSvgcleanFront() {
		return del(config.pcSvgFront.clean)
	}
	pcSvgcleanFront.description = 'Mobile svg sprite 이미지파일과 관련SCSS 파일을 제거합니다.'
	function pcSvgGuideCleanFront() {
		return del('./src/pc/svg-guide/front')
	}
	pcSvgGuideCleanFront.description = 'Mobile svg sprite guide관련 폴더와 파일을 제거합니다.'
	function pcBuildsvgOnestop() {

		function svgOpt(dirPath) {
			return {
				shape: {
					spacing: {
						padding:2,
						box: 'content'
					},
					transform :[
						shapeTransform,
						'svgo',
					]
				},
				mode: {
					css: {
						bust: false,
						dest: '.',
						prefix: '%s',
						sprite: 'dist/pc/css/vendorsSvg/onestop/' + path.basename(dirPath) + '.svg',
						render: {
							scss: {
								template: './gulp/helper/svgsprite-scss-tmpl.mustache',
								dest: 'src/pc/resources/sass/onestop/vendorsSvg/_' + path.basename(dirPath) + '.scss',
							}
						},
						example: {
							template: './gulp/helper/svg-guide-tmpl.html',
							dest: './src/pc/svg-guide/onestop/' + path.basename(dirPath) + '.html'
						}
					}
				},
				svg:{
					namespaceClassnames:false,
					transform       : [
						/**
						 * Custom sprite SVG transformation
						 *
						 * @param {String} svg					Sprite SVG
						 * @return {String}						Processed SVG
						 */
						function(svg) {
							if(svg.match('keyframes')) {
								svg=svg.replace(/<script>/, '<style>').replace(/<\/script>/, '<\/style>');
							}
							return svg;
						},
					]
				},
				//scss에서 사용하는 코드
				variables: {
					svgcode: function() {
						return function(svg,render) {
							svg=render(svg).replace(/<svg[^>]*>|<\/svg>/gi,'').replace(/%/g,'%25').replace(/#/g,'%23');
							if(svg.match('keyframes')){
								svg=svg.replace(/<script>/, '<style>').replace(/<\/script>/, '<\/style>');
							}
							return svg;
						}
					},
					time: now
				}
			}
		}

		return glob('src/pc/resources/images/onestop/svg/**/', function(err, dirs) {
			dirs.forEach(function(dir) {
				gulp.src(path.join(dir, '*.svg'),{base:dir})
					.pipe(fileCache.filter())
					.pipe($.plumber({
						errorHandler: envConfig.isProduction ? false : true
					}))
					.pipe(svgmin())
					.pipe(svgSprite(svgOpt(dir)))
					.pipe(fileCache.cache())
					.pipe(gulp.dest('.'));
			})
		});

	}


	gulp.task(mSvgcleanFront);
	gulp.task(mSvgGuideCleanFront);
	gulp.task(mBuildsvgFront);

	gulp.task(pcSvgcleanFront);
	gulp.task(pcSvgGuideCleanFront);
	gulp.task(pcBuildsvgFront);

	gulp.task('mSvgSprite', gulp.series('mSvgcleanFront', 'mSvgGuideCleanFront', 'mBuildsvgFront'))
	gulp.task('pcSvgSprite', gulp.series('pcSvgcleanFront', 'pcSvgGuideCleanFront', 'pcBuildsvgFront'))
};
