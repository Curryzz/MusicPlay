var gulp = require("gulp");//获取gulp
var htmlclean = require("gulp-htmlclean");//压缩html插件
var imgMin = require("gulp-imagemin"); //压缩图片插件
var uglify = require("gulp-uglify");//压缩js代码
var strip = require("gulp-strip-debug"); //去掉调试语句插件
var concat = require("gulp-concat"); //拼接js文件
var less = require("gulp-less");//less转css插件
var postcss = require("gulp-postcss");
var autoprefixer = require("gulp-autoprefixer");//添加css3前缀插件
var cssnano = require("gulp-cssnano");//压缩css代码
var connect = require("gulp-connect");//开一个模拟服务器

//获取环境变量 producation:生产环境  development:开发环境   export NODE_ENV=development
var devMode = process.env.NODE_ENV == "development"//如果是开发环境返回true
var folder = {
    src: "src/", //开发目录
    dist: "dist/" //压缩打包后的文件夹 
}

gulp.task("html", function () {
    var page = gulp.src(folder.src + "html/*")
        .pipe(connect.reload())//自动刷新
    if (!devMode) {
        page.pipe(htmlclean()) //执行压缩html插件
    }
    page.pipe(gulp.dest(folder.dist + "html/"))

})
gulp.task("img", function () {
    var page = gulp.src(folder.src + "img/*")
    if (!devMode) {
        page.pipe(imgMin()) //执行压缩图片插件
    }
    page.pipe(gulp.dest(folder.dist + "img/"))
})

gulp.task("js", function () {
    var page = gulp.src(folder.src + "js/*")
        .pipe(connect.reload())//自动刷新
        // .pipe(concat("main.js")) //把开发环境下的所有js文件，全部拼接到运行环境的main.js一个文件里
    if (!devMode) {
        page.pipe(uglify()) //执行压缩js插件
    }
    page.pipe(gulp.dest(folder.dist + "js/"))
})

gulp.task("css", function () {
    var options = [autoprefixer(), cssnano()];
    var page = gulp.src(folder.src + "css/*")
        .pipe(connect.reload())//自动刷新
        .pipe(less()) //执行less转css插件 
        // .pipe(postcss(options))
        .pipe(gulp.dest(folder.dist + "css/"))
})

gulp.task("server", function () {
    connect.server({
        port: "8090", //修改端口
        livereload: true //开启浏览器自动刷新
    })
})

// 监听文件改变，执行文件
gulp.task("watch", function () {
    gulp.watch(folder.src + "html/*", ["html"]);
    gulp.watch(folder.src + "css/*", ["css"]);
    gulp.watch(folder.src + "js/*", ["js"]);
    gulp.watch(folder.src + "img/*", ["img"]);

})

//执行任务队列
gulp.task("default", ["html", "img", "js", "css", "watch", "server"])