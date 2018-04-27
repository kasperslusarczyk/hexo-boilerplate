// config
var project_path = 'localhost/base_webpack/';
var gulp = require('gulp');
var fs = require('fs');
var rename = require('gulp-rename');
var realFavicon = require ('gulp-real-favicon');
var svgfallback = require('gulp-svgfallback');

gulp.task('build', ['generate-favicon', 'inject-favicon-markups', 'svg']);

// File where the favicon markups are stored
var FAVICON_DATA_FILE = './themes/yourtheme/source/faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', (done) => {
	realFavicon.generateFavicon({
		masterPicture: './themes/yourtheme/lib/favicon/favicon_src.png',
		dest: './themes/yourtheme/source/assets/favicons',
		iconsPath: '/assets/favicons',
		design: {
			ios: {
				pictureAspect: 'backgroundAndMargin',
				backgroundColor: '#ffffff',
				margin: '14%',
				assets: {
					ios6AndPriorIcons: false,
					ios7AndLaterIcons: false,
					precomposedIcons: false,
					declareOnlyDefaultIcon: true
				}
			},
			desktopBrowser: {},
			windows: {
				pictureAspect: 'noChange',
				backgroundColor: '#ffffff',
				onConflict: 'override',
				assets: {
					windows80Ie10Tile: false,
					windows10Ie11EdgeTiles: {
						small: false,
						medium: true,
						big: false,
						rectangle: false
					}
				}
			},
			androidChrome: {
				pictureAspect: 'backgroundAndMargin',
				margin: '17%',
				backgroundColor: '#ffffff',
				themeColor: '#ffffff',
				manifest: {
					name: 'Rdbrck',
					display: 'standalone',
					orientation: 'notSet',
					onConflict: 'override',
					declared: true
				},
				assets: {
					legacyIcon: true,
					lowResolutionIcons: false
				}
			},
			safariPinnedTab: {
				pictureAspect: 'silhouette',
				themeColor: '#7140CC'
			}
		},
		settings: {
			scalingAlgorithm: 'Mitchell',
			errorOnImageTooSmall: false
		},
		markupFile: FAVICON_DATA_FILE
	}, function() {
		done();
	});
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', ['generate-favicon'], () => {
	return gulp.src([ './themes/yourtheme/layout/_partial/favicon.ejs' ])
		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
		.pipe(gulp.dest('./themes/yourtheme/layout/_partial'));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', (done) => {
	var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
	realFavicon.checkForUpdates(currentVersion, function(err) {
		if (err) {
			throw err;
		}
	});
});

gulp.task('svg', ['svg-fallback', 'move-icons']);

gulp.task('move-icons', () => {
   gulp.src('./themes/yourtheme/lib/icons/*.svg')
   .pipe(gulp.dest('./themes/yourtheme/source/assets/images/icons'));
});

gulp.task('svg-fallback', () => {
    return gulp
        .src('./themes/yourtheme/lib/icons/*.svg', {base: './themes/yourtheme/lib/icons'})
        .pipe(rename({prefix: ''}))
        .pipe(svgfallback({cssTemplate: './themes/yourtheme/lib/icons/template/style.css'}))
        .pipe(gulp.dest('./themes/yourtheme/source/assets/images/icons/'));
});
