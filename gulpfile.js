const gulp 		= require('gulp');
const htmlmin 	= require('gulp-html-minifier2');
const uglify	= require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');
const pump 		= require('pump');
const concat	= require('gulp-concat');
const babel		= require('gulp-babel');
const sass		= require('gulp-sass');
const gls 		= require('gulp-live-server');

gulp.task('moveIndex', () => {
	gulp.src('./src/index.html')
		// Xóa tất cả khoảng trắng sau khi compiled
		.pipe(htmlmin({ collapseWhitespace: true }))
		// Copy file index vào thư mục dist
		.pipe(gulp.dest('./dist/'));
});

gulp.task('javascript', (cb) => {
	/* Dùng pump + uglify khi muốn copy file, nối 
	các biến khai báo với nhau bằng dấu phẩy sau khi compiled */
	pump([
		gulp.src('./src/assets/js/*.js')
			.pipe(babel({
				presets: ['es2015']
			})), // biên dịch syntax es6/7
			concat('main.js'), // gộp tất cả các file js thành 1 file
			uglify(),
			gulp.dest('./dist/js/')
	], cb); 
	// Kết quả: 'use strict';var one="Hello Trung 1",other="Other variables";
});

gulp.task('sass', () => {
	gulp.src('./src/assets/scss/*.scss')
		.pipe(sass()) // biên dịch mã sass thành mã css thường
		.pipe(uglifycss({
			"maxLineLen": 80,
			"uglyComments": true
		})) // minified css viết hết trên 1 dòng liên tiếp, bỏ hết khoảng trắng.
		.pipe(gulp.dest('./dist/css')) // copy tới thư mục /dist/css
});

gulp.task('serve', () => {
	const server = gls.static('./dist', 9999);
});

// Chạy tất cả các task song song với 1 câu lệnh "gulp"
gulp.task('default', ['moveIndex', 'javascript', 'sass', 'serve']);