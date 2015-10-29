'use strict';

var gulp = require('gulp'),
    inject = require('gulp-inject'),
    del = require('del'),
    runSequence = require('run-sequence'),
    mainBowerFiles = require('main-bower-files'),
    browserSync = require('browser-sync'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    gulpif = require('gulp-if'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    concat = require('gulp-concat'),
    sass= require('gulp-sass');

var args = require('yargs')
    .alias('d', 'debug')
    .alias('p', 'product')
    .default('debug', true)
    .default('product', false)
    .argv;


var product = args.product;
var debug = args.debug;
var targetDir;

if(product){
    targetDir = 'www';
}
else{
    targetDir = '.tmp';
}

//清理目录
gulp.task('clean', function(){
    del.sync(targetDir);
});

//复制库和app文件夹下的相关的字体文件
gulp.task('fonts', function(){
    gulp.src(mainBowerFiles({
        filter: '**/*.{eot,svg,ttf,woff,woff2}'
    }).concat('app/fonts/**/*'))
        .pipe(gulp.dest(targetDir+'/fonts'));
});

//复制templates文件
gulp.task('templates', function(){
    gulp.src('app/templates/**/*.html')
        .pipe(gulp.dest(targetDir+'/templates'));
});

//复制图片
gulp.task('images', function(){
    gulp.src('app/images/**/*')
        .pipe(gulp.dest(targetDir+'/images'));
});


//编译sass,scss,复制css
gulp.task('styles', function(){
    gulp.src('app/styles/**/*.{css,sass,scss}')
        .pipe(gulpif('*.sass' || '*.scss', sass().on('error', sass.logError)))
        .pipe(gulp.dest(targetDir + '/styles'));
});

//复制js文件
gulp.task('scripts', function(){
    gulp.src('app/scripts/**/*.js')
        .pipe(gulp.dest(targetDir + '/scripts'));
});

//导入相关的css库文件和js库文件
gulp.task('inject', function(){
    var styles = gulp.src('app/styles/**/*.{css,sass,scss}')
        .pipe(gulpif('*.sass' || '*.scss', sass().on('error', sass.logError)));

    var scripts = gulp.src('app/scripts/**/*.js', {read: false});

    var libSources = gulp.src(mainBowerFiles({filter: '**/*.{css,js}'}), {read: false});

    gulp.src('app/index.html')
        .pipe(inject(libSources, {name: 'lib'}))
        .pipe(inject(styles, {name: 'sass', relative: true}))
        .pipe(inject(scripts, {relative: true}))
        .pipe(gulp.dest(targetDir));
});

//检查js语法
gulp.task('jshint', function(){
    gulp.src('app/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

//在生产状态下, 构建和压缩css,js文件
gulp.task('uglify', function(){
    var assets = useref.assets();
    var styles = gulp.src('app/styles/**/*.{css,sass,scss}')
        .pipe(gulpif('*.sass' || '*.scss', sass().on('error', sass.logError)))
        .pipe(gulp.dest('.tmp/sass'));
    var scripts = gulp.src('app/scripts/**/*.js', {read:false});
    var libSources = gulp.src(mainBowerFiles({filter: '**/*.{css,js}'}), {read: false});

    gulp.src('app/index.html')
        .pipe(inject(libSources, {name: 'lib', relative: true}))
        .pipe(inject(styles, {name: 'sass', relative: true}))
        .pipe(inject(scripts, {relative: true}))
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(targetDir));
});

//允许一个小型后台进行效果的查看
gulp.task('serve', function(){
    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: [targetDir],
            routes: {
                '/bower_components': 'bower_components'
            }
        }
    });

    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/styles/**/*.css', ['styles']);
    gulp.watch('app/templates/**/*.html', ['templates']);
    gulp.watch('app/images/**/*', ['images']);
    gulp.watch('app/fonts/**/*', ['fonts']);
    gulp.watch('app/index.html', ['inject']);

    gulp.watch('app/**')
        .on('change', browserSync.reload);
});


//进行生产状态的build
gulp.task('build', function(){
    targetDir = 'www';
    runSequence(
        'clean',
        'fonts',
        'images',
        'templates',
        'uglify'
    );
});

//默认任务
gulp.task('default', function(){
    if(!product) {
        runSequence(
            'clean',
            'fonts',
            'images',
            'templates',
            'styles',
            'scripts',
            'inject',
            'serve'
        );
    }
    else{
        targetDir = 'www';
        runSequence(
            'clean',
            'fonts',
            'images',
            'templates',
            'uglify',
            'serve'
        );
    }
});