module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  // object to represent the type of environment we are running in.
  // eg. production or development
  var EnvType = {
    prod: 'production',
    dev: 'development'
  };
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      build: {
        src: ['build/']
      }
    },
    // copy files into dist directory
    copy: {
      build: {
        files: [
          {
            cwd: 'bower_components/',
            src: ['angular/angular.js'],
            dest: 'build/',
            expand: true
          },
          {
            cwd: 'src/',
            src: ['app.js', 'jquery.min.js', 'app.css'],
            dest: 'build/',
            expand: true
          },
        ],
      },
    },
    hashres: {
      options: {
        encoding: 'utf8',
        fileNameFormat: '${name}.${hash}.cache.${ext}',
        renameFiles: true
      },
      js: {
        options: {},
        src: ['build/js/app.js'],
        dest: ['dist/index.html', 'dist/index.php']
      }
    },
    jade: {
      compile: {
        options: {
          pretty: true,
          data: {
            debug: true
          }
        },
        files: {
          "build/index.html": ["src/index.jade"]
        }
      }
    },
    watch: {
      files: ['build/*.html'],
      jade: {
        files: ['src/*.jade'],
        tasks: ['jade']
      },
      options: {
        livereload: true
      }
    }
  });
  /**
   * Utility function to register the build task to grunt.
   * @param  {[type]} mode  [the mode, either dev, or production]
   */
  var registerBuildTask = function(mode) {
    tasks = [];
    tasks.push('clean');
    tasks.push('copy');
    tasks.push('jade');
    grunt.registerTask('build:' + mode, 'jade!' + ' !', tasks);
  };
  /**
   * Utility function to register the server task to grunt.
   * @param  {[type]} mode  [the mode, either dev, or production]
   */
  var registerServerTask = function(mode) {
    // var tasks = ['express', 'open'];
    var tasks = []
      // if we are running in development mode, run the watch task
    if (mode === EnvType.dev) {
      tasks.push('watch');
    }
    // otherwise run the 'express-keepalive' task so that the server continues
    // to run
    else if (mode === EnvType.prod) {
      // tasks.push('connect:dist:keepalive');
    }
    grunt.registerTask('server:' + mode, 'constantly watching for changes', tasks);
  };
  /**
   * Utility function to register the main task to grunt.
   * @param  {[type]} mode  [the mode, either dev, or production]
   */
  var registerMainTask = function(mode) {
    grunt.registerTask(mode, 'Watches the project for changes' + 'automatically builds them and runs a server', ['build:' + mode, 'server:' + mode]);
  };
  registerBuildTask(EnvType.dev);
  registerBuildTask(EnvType.prod);
  registerServerTask(EnvType.dev);
  registerServerTask(EnvType.prod);
  registerMainTask(EnvType.dev);
  registerMainTask(EnvType.prod);
  // register development mode as the main task
  grunt.registerTask('default', 'Default task: development', 'development');
};