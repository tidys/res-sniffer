var gulp = require('gulp');
var less = require('gulp-less'); // less编译
var concat = require('gulp-concat'); // 文件合并
var plumber = require('gulp-plumber'); // 处理管道崩溃问题
var notify = require('gulp-notify'); // 报错与不中断当前任务
gulp.task('editor', (cb) => {
    return gulp
        .src('src/**/*.less')
        .pipe(
            plumber({
                errorHandler: notify.onError('Error:<%= error.message %>;')
            })
        )
        .pipe(less())
        .pipe(concat('index.css'))
        .pipe(gulp.dest('src/'));
});

gulp.task('less-watch', () => {
    gulp.watch('src/**/*.less', gulp.series('editor'))
})
