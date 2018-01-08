'use strict';
var gulp = require('gulp'),
    webpack = require('webpack'),
    ora = require('ora'),
    gulpWebpack = require('webpack-stream'),
    watch = require('gulp-watch'),
    istanbul = require('gulp-istanbul'),
    mocha = require('gulp-mocha'),
    isparta = require('isparta'),
    notify = require('gulp-notify'),
    clean = require('gulp-clean'),
    path = require('path'),
    fs = require('fs'),
    _ = require('lodash');

// 依赖NODE_ENV和NODE_ENV_UAT环境变量的配置
var app = require('./config/env');
const rootdir = app.rootdir;
const distPath = app.dist;
const zipFileName = require('./package.json').name + '.zip';
const zipDestPath = __dirname;

var tasks = {
    /**
     * 清除目录
     */
    'clean': {
        excute: function () {
            return gulp.src('dist/*', {read: false})
                .pipe(clean())
                .on('end', () => {
                    notify({message: '目录清理完成 - [dist/]'});
                });
        }
    },
    /**
     * 清除目录(不包含dll)
     */
    'cleanWithoutDLL': {
        excute: function () {
            return gulp.src([`${distPath}/*`, `!${[distPath, 'dll'].join('/')}`], {read: false})
                .pipe(clean())
                .on('end', () => {
                    notify({message: '目录清理完成 - [dist/]'});
                });
        }
    },
    /**
     * 打包webpack dll文件
     */
    'compileDll': {
        excute: function () {
            let promise = new Promise(function (resolve, reject) {
                let compiler = webpack(require('./config/build/webpack.dll.conf.js'));
                compiler.run((err, stats) => {
                    if (err) throw err;
                    resolve(stats);
                });
            });
            return promise;
        }
    },
    /**
     * webpack开发环境编译
     */
    'webpackdev': {
        excute: function () {
            return gulp.src(path.resolve(rootdir, 'views/main.js'))
                .pipe(gulpWebpack(require('./config/build/webpack.dev.conf.js'), webpack))
                .pipe(gulp.dest(distPath));
        }
    },
    /**
     * webpack生产环境编译
     */
    'webpackprod': {
        excute: function () {
            return gulp.src(path.resolve(rootdir, 'views/main.js'))
                .pipe(gulpWebpack(require('./config/build/webpack.prod.conf.js'), webpack))
                .pipe(gulp.dest(distPath));
        }
    },
    /**
     * 清除zip
     */
    'cleanZip': {
        excute: function () {
            return gulp.src(zipDestPath + zipFileName, {read: false})
                .pipe(clean())
                .on('end', () => {
                    notify({message: 'Clean zip before package...'});
                });
        }
    },
    /**
     * 项目打包-zip
     */
    'package': {
        excute: function () {
            const list = [
                path.join(__dirname, '**', '*.*'),
                path.join(__dirname, '**', '.gitkeep'),
                '.babelrc',
                './node_modules/**/*.*',
                '!./coverage/**/*.*',
                '!./test/**/*.*',
                '!./views/**/*.*',
                '!./.git/**/*.*',
                '!./.idea/**/*.*',
                '!./.vscode/**/*.*',
                '!./README.md',
                '!./gulpfile.js',
                '!./package-lock.json',
                '!./*.zip'
            ];
            gulp.src(list)
                .pipe(GulpZipEnhancePlugin(zipFileName, {
                    mode4file: parseInt('0100766', 8), // -rwxrw-rw-
                    mode4directory: parseInt('0100755', 8) // drwxr-xr-x
                }))
                .pipe(gulp.dest(zipDestPath))
                .pipe(notify({message: 'Package done...'}));
        }
    }
};

/**
 * gulp-zip改进
 * Issue: Linux中会存在文件读写权限缺失
 * Enhancement：将mode暴露出来
 */
var GulpZipEnhancePlugin = (function () {
    let through2 = require('through2');
    let Yazl = require('yazl');
    let getStream = require('get-stream');
    let gutil = require('gulp-util');
    let GulpZipPlugin = function (filename, options) {
        let firstFile = null,
            zip = new Yazl.ZipFile();
        let opts = Object.assign({
            compress: true,
            mtime: new Date(),
            mode4file: null,
            mode4directory: null
        }, options);
        filename = filename || 'unnamed.zip';
        return through2.obj(function (file, encode, callback) {
            if (!firstFile) {
                firstFile = file;
            }
            // Because Windows...
            const pathname = file.relative.replace(/\\/g, '/');
            if (!pathname) {
                return cb();
            }
            if (file.isNull() && file.stat && file.stat.isDirectory && file.stat.isDirectory()) {
                zip.addEmptyDirectory(pathname, {
                    mtime: file.stat.mtime || opts.mtime,
                    mode: opts.mode4directory ? opts.mode4directory : file.stat.mode // parseInt("0100755", 8) // -rwxr-xr-x
                });
            } else {
                const stat = {
                    compress: opts.compress,
                    mtime: file.stat ? file.stat.mtime : opts.mtime,
                    mode: opts.mode4file ? opts.mode4file : file.stat.mode //parseInt("0100766", 8) // -rwxrw-rw-
                };

                if (file.isStream()) {
                    zip.addReadStream(file.contents, pathname, stat);
                }

                if (file.isBuffer()) {
                    zip.addBuffer(file.contents, pathname, stat);
                }
            }
            callback();
        }, function (cb) {
            if (!firstFile) {
                return cb();
            }

            getStream.buffer(zip.outputStream).then(data => {
                this.push(new gutil.File({
                    cwd: firstFile.cwd,
                    base: firstFile.base,
                    path: path.join(firstFile.base, filename),
                    contents: data
                }));

                cb(); // eslint-disable-line promise/no-callback-in-promise
            });

            zip.end();
        });
    };
    return GulpZipPlugin;
})();

function TaskExecuter(gulp, tasks) {
    if (!_.isObject(tasks)) {
        throw new Error('tasks is required!');
    }
    this._gulp = gulp;
    this._tasks = tasks;
}
/**
 * 执行任务
 */
TaskExecuter.prototype.excute = function () {
    var thiz = this,
        tasks = thiz._tasks,
        gulp = thiz._gulp,
        taskNameList = [],
        previousTask;
    //add task
    _.each(tasks, function (value, key) {
        gulp.add(key, previousTask && [previousTask], value['excute']); //name, dep, fn
        taskNameList.push(key);
        previousTask = key;
    });
    gulp.start.apply(gulp, taskNameList);
};

/**
 * uat环境和production可以共用webpack.prod.conf.js
 */
gulp.task('build:prod', function (cb) {
    let taskList = {
        clean: tasks.clean,
        dll: tasks.compileDll,
        prod: tasks.webpackprod
    };
    let executer = new TaskExecuter(gulp, taskList);
    executer.excute();
});

/**
 * 开发环境实时编译
 * Usage:
 *  npm run watch [:dll]，其中:dll表示强制重新编译DLL
 */
gulp.task('build:dev', function () {
    // console.log(process.argv);
    let forceBuildDLL = process.argv.slice(4).join('') === ':dll';
    let flag = false;
    try {
        fs.accessSync(path.join(distPath, 'dll'));
    } catch (e) {
        flag = true;
        console.error('[WARN]', e.code, e.message);
    }
    flag = forceBuildDLL || flag;
    let taskList = {};
    let list = [];
    list.push({name:'clean', task:tasks.cleanWithoutDLL});
    !!flag && list.push({name:'dll', task:tasks.compileDll});
    list.push({name:'dev', task:tasks.webpackdev});
    list.forEach(item=>taskList[item.name] = item.task);
    let executer = new TaskExecuter(gulp, taskList);
    executer.excute();
});

gulp.task('build:dll', function () {
    let taskList = {
        dll: tasks.compileDll,
    };
    let executer = new TaskExecuter(gulp, taskList);
    executer.excute();
});

gulp.task('package', function () {
    let taskList = {
        clean: tasks.clean,
        dll: tasks.compileDll,
        prod: tasks.webpackprod,
        cleanZip: tasks.cleanZip,
        package: tasks.package
    };
    let executer = new TaskExecuter(gulp, taskList);
    executer.excute();
});

/**
 * 单元测试
 */
gulp.task('pre-cover', function(){
    return gulp.src(['./app.js', './app/**/*.js'])
        .pipe(istanbul({
            instrumenter: isparta.Instrumenter,
            includeUntested: true,
        }))
        .pipe(istanbul.hookRequire());
});
gulp.task('cover', ['pre-cover'], function () {
    return gulp.src(['./test/app/controller/**/*.test.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports({
            dir: './coverage',
            reporters: [ 'lcov', 'json', 'text', 'text-summary', 'html' ],
            reportOpts: { dir: './coverage' },
        }))
        // .pipe(istanbul.enforceThresholds({thresholds:{global:90}}))
});
