import gulp from 'gulp'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import minifyCSS from 'gulp-csso'
import del from 'del'
import browserify from 'gulp-browserify'
import babel from 'babelify'

sass.compiler = require('node-sass')

const paths = {
  styles: {
    src: [
      'src/assets/scss/styles.scss'
    ],
    dest: 'src/assets/css',
    watch: 'src/assets/scss'
  }

  // js: {
  //   src: "assets/js/main.js",
  //   dest: "static",
  //   watch: "assets/js/**/*.js"
  // }
}

const clean = () => del(['static'])

const styles = () =>
  gulp
    .src(paths.styles.src)
    .pipe(sass())
    .pipe(
      autoprefixer()
    )
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.styles.dest))

/**

const js = () =>
  gulp
    .src(paths.js.src)
    .pipe(
      browserify({
        transform: [
          babel.configure({
            presets: ["@babel/preset-env"]
          })
        ]
      })
    )
    .pipe(gulp.dest(paths.js.dest));

*/

const watchFiles = () => {
  gulp.watch(paths.styles.watch, styles)
  // gulp.watch(paths.js.watch, js);
}

const dev = gulp.series(clean, styles, watchFiles)
// const dev = gulp.series(clean, styles, js, watchFiles);

export const build = gulp.series(clean, styles)
// export const build = gulp.series(clean, styles, js);

export default dev
