'use strict';

var yeoman = require('yeoman-generator');
var mkdirp = require('mkdirp');

var gulpWebGenerator = yeoman.Base.extend({
    greet: function () {
        var done = this.async();
        this.log('Starting gulp-web bootstrap...');
        this.appname = process.argv[3];
        if (typeof this.appname === 'undefined' || this.appname.length == 0) {
            this.prompt([{
                type: 'input',
                message: 'What\'s your app name',
                name: 'appname'
            }], function (props) {
                this.appname = props.appname;
                if (this.appname == null || this.appname.length == 0) {
                    this.appname = 'temp';
                }

                this.destinationRoot(this.appname);
                done();
            }.bind(this));
        }
        else{
            this.destinationRoot(this.appname);
            done();
        }
    },
    scaffoldFolders: function () {
        mkdirp("app");
        mkdirp("app/styles");
        mkdirp("app/scripts");
        mkdirp("app/fonts");
        mkdirp("app/images");
        mkdirp("app/templates");
    },
    copyFiles: function () {
        this.fs.copyTpl(this.templatePath('html/_index.html'), this.destinationPath('app/index.html'), {appname: this.appname});
        this.fs.copyTpl(this.templatePath('js/_app.js'), this.destinationPath('app/scripts/app.js'), {appname: this.appname});
        this.fs.copyTpl(this.templatePath('others/_.gitignore'), this.destinationPath('./.gitignore'));
        this.fs.copyTpl(this.templatePath('others/_gulpfile.js'), this.destinationPath('./gulpfile.js'));
        this.fs.copyTpl(this.templatePath('others/_bower.json'), this.destinationPath('./bower.json'), {appname: this.appname});
        this.fs.copyTpl(this.templatePath('others/_package.json'), this.destinationPath('./package.json'), {appname: this.appname});
        this.fs.copyTpl(this.templatePath('others/_README.txt'), this.destinationPath('./README.txt'));
    },
    installDependencies: function () {
        console.log('I am all done.\nPlease run bower install & npm install to install the dependencies.');
        //var done = this.async();
        //    this.prompt([{
        //        type: 'confirm',
        //        message: 'Run bower install & npm install',
        //        name: 'install'
        //    }], function (props) {
        //        if (props.install) {
        //            this.npmInstall(
        //                ['gulp', 'gulp-inject', 'wiredep', 'del', 'run-sequence', 'main-bower-files', 'browser-sync'],
        //                {'save': true});
        //            this.bowerInstall(
        //                ['angular', 'angular-route', 'bootstrap'],
        //                {'save': true}
        //            );
        //        }
        //        done();
        //    }.bind(this));
    }

});


module.exports = gulpWebGenerator;