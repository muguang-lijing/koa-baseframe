var gulp = require('gulp'),
    assetRev = require('gulp-asset-rev'), //添加版本号
    imagemin = require('gulp-imagemin'), //图片压缩
    connect = require('gulp-connect'), //实时监听
    webpack = require('gulp-webpack'),  //webpack
    less = require('gulp-less'), //编译less
    babel = require('gulp-babel'), //编译es6
    webpackConfig = require("./webpack.config.js"),
    named = require('vinyl-named'),
    clean = require('gulp-clean'),
    cache = require('gulp-cache'),
    uglify = require('gulp-uglify'), //压缩JS
    cssmin = require('gulp-minify-css'),//压缩CSS
    htmlmin = require('gulp-htmlmin');  //压缩HTML

var options = {
    removeComments: true,//清除HTML注释
    collapseWhitespace: true,//压缩HTML
    collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
    minifyJS: true,//压缩页面JS
    minifyCSS: true//压缩页面CSS
};

var Htmlsrc = './public/src/pc/*.html',   //html文件入口路径
    JSsrc = './public/src/js/*.js',     //Js文件入口路径
    Csssrc = './public/src/css/*.*',   //Css文件入口路径，包括less和sass
    Imgsrc = './public/src/img/*.*';   //图片入口路径

//压缩图片
gulp.task('Compress_img', function () {
    gulp.src(Imgsrc)
        .pipe(cache(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        })))
        .pipe(gulp.dest('dist/img'));
});

//添加版本号和压缩html
gulp.task('rev_pc', ['revCss', 'revJs'], function () {
    return gulp.src(Htmlsrc)
        .pipe(named())
        .pipe(assetRev())
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./public/dist/pc'))
        .pipe(connect.reload());
});

//清除gulp缓存
gulp.task('clean', function () {
    return gulp.src(['./public/dist/pc','./public/dist/js/','./public/dist/css/','dist/img'], { read: false })
        .pipe(clean());
});

//编译es6和压缩JS,webpack打包
gulp.task('revJs', function () {
    return gulp.src(JSsrc)        //尽量做到1个页面引用一个JS
        .pipe(named())
        .pipe(webpack(webpackConfig, null, function () { }))
        .pipe(babel())
        .pipe(assetRev())
        .pipe(uglify())
        .pipe(gulp.dest('./public/dist/js/'))
        .pipe(connect.reload());
});

//压缩CSS和编译LESS
gulp.task('revCss', function () {
    return gulp.src(Csssrc)
        .pipe(less())
        .pipe(named())
        .pipe(assetRev())
        .pipe(cssmin())
        .pipe(gulp.dest('./public/dist/css/'))
        .pipe(connect.reload());
});

//实时监听
gulp.task('connect', function () {
    connect.server({
        root: 'app',
        livereload: true
    });
});

//监听文件变化
gulp.task('watch', function () {
    gulp.watch('./public/src/pc/*.html', ['rev_pc']);
    gulp.watch('./public/src/js/*.js', ['revJs']);
    gulp.watch('./public/src/css/*.css', ['revCss']);
});

//开始构建
gulp.task('default', ['connect', 'watch', 'rev_pc','Compress_img']);

