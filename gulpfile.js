const gulp = require("gulp");

const sass = require("gulp-sass");

const cssnano = require("gulp-cssnano");

const rev = require("gulp-rev");

//gulp is like passport.js which is a managing thing for several tasks going on and handles the tasks accordingly
gulp.task("css", function (done) {
  console.log("minifying css");
  gulp
    .src("./assets/scss/*.scss")
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest("./minCss/css"));

  return gulp
    .src("./minCss/**/*.css")
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest({
        //it is a manifest
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
  done();
});
