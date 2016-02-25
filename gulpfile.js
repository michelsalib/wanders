var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');
var runSequence = require('run-sequence');
var karmaServer = require('karma').server;

// define tasks here
gulp.task('info', function () {
    var pack = require('./package.json');

    console.log('\n' +
        'Project: ' + pack.name + '\n' +
        'Version: ' + pack.version);

    if (-1 != process.argv.indexOf('--node-version')) {
        console.log('Node version: ' + process.version + '\n');
    }
    else {
        console.log();
    }
});

gulp.task('clean-dist', function () {
    return gulp
        .src('dist/**/*', {read: false})
        .pipe(clean({force: true}));
});

gulp.task('build-js-dist', function () {
    return gulp
        .src('src/*.js')
        .pipe(concat('index.js'))
        .pipe(uglify({
            mangle: -1 != process.argv.indexOf('--prod')
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('build-resource-dist', function () {
    return gulp
        .src('src/*.{html,css}')
        .pipe(gulp.dest('dist'));
});

gulp.task('serve', function() {
    gulp.src('dist')
        .pipe(webserver({
            livereload: true,
            open: true,
            port: 8100
        }));
});

gulp.task('watch-files', function() {
    gulp.watch('src/*.{html,css}', ['build-resource-dist']);
    gulp.watch('src/*.js', ['build-js-dist']);
});

gulp.task('run', function(done) {
    runSequence('build', ['watch-files', 'serve'], done);
});

gulp.task('build', ['clean-dist', 'build-js-dist', 'build-resource-dist']);

gulp.task('test', ['build'], function(done) {
    karmaServer.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

// define tasks here
gulp.task('default', function () {
    console.log('Hello!');
});
