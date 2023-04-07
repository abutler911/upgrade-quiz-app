const gulp = require("gulp");
const concat = require("gulp-concat");
const cssmin = require("gulp-cssmin");

gulp.task("css", function () {
  return gulp
    .src("./public/css/*.css")
    .pipe(concat("style-new.css"))
    .pipe(cssmin())
    .pipe(gulp.dest(".public/css"));
});
