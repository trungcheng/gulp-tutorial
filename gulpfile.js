const gulp 		= require('gulp');
const htmlmin 	= require('gulp-html-minifier2');
const uglify	= require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');
const pump 		= require('pump');
const concat	= require('gulp-concat');
const babel		= require('gulp-babel');
const sass		= require('gulp-sass');
const gls 		= require('gulp-live-server');
const os		= require('os');
const open		= require('gulp-open');

gulp.task('moveIndex', () => {
	gulp.src('./src/index.html')
		// Remove all white spaces after compiled
		.pipe(htmlmin({ collapseWhitespace: true }))
		// Copy index.html file into /dist folder
		.pipe(gulp.dest('./dist/'));
});

gulp.task('javascript', (cb) => {
	pump([
		gulp.src('./src/assets/js/*.js')
			.pipe(babel({
				presets: ['es2015']
			})), // compile es6/7 syntax
			concat('main.js'), // combine all js files to one file.
			uglify(),
			gulp.dest('./dist/js/')
	], cb); 
	// Output: 'use strict';var one="Hello Trung 1",other="Other variables";
});

gulp.task('sass', () => {
	gulp.src('./src/assets/scss/*.scss')
		.pipe(sass()) // compile scss to css.
		.pipe(uglifycss({
			"maxLineLen": 80,
			"uglyComments": true
		})) // minified css on one line and remove all white spaces.
		.pipe(gulp.dest('./dist/css')) // copy to /dist/css folder.
});

gulp.task('serve', () => {
	const server = gls.static('./dist', 9999);
	server.start();
	// Watch the changing
	gulp.watch(['./dist/css/*.css', './dist/js/*.js', './dist/index.html'], (file) => {
		server.notify.apply(server, [file]);
	});
	// Detech browser type and open app on it automatically.
	const browser = os.platform() === 'linux' ? 'google-chrome' : (
		os.platform() === 'darwin' ? 'google chrome' : (
			os.platform() === 'win32' ? 'chrome' : 'firefox'
		)
	);
	const options = {
		uri: 'http://localhost:9999',
		app: browser
	}
	gulp.src('./dist/index.html')
		.pipe(open(options));
});

// Run all tasks parallel with "gulp" command.
gulp.task('default', ['moveIndex', 'javascript', 'sass', 'serve'], () => {
	// Watch the change of html, scss, js files.
	gulp.watch('./src/*.html', ['moveIndex']);
	gulp.watch('./src/assets/js/*.js', ['javascript']);
	gulp.watch('./src/assets/scss/*.scss', ['sass']);
	console.log('Watching for files');
});

// Run develop environment with "gulp build" command.
gulp.task('build', ['moveIndex', 'javascript', 'sass']);