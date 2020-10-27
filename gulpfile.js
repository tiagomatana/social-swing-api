const gulp = require('gulp')

gulp.task('copy-html', () => {
    return gulp.src('./src/html/*.html').pipe(gulp.dest('./dist/html'))
})