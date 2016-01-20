var pushState = require('grunt-connect-pushstate/lib/utils').pushState;
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'public/assets/js/<%= pkg.name %>.js',
        dest: 'public/assets/js/<%= pkg.name %>.min.js'
      }
    },
    connect: {
      development: {
        options: {
          hostname: process.env.HOST || "127.0.0.1",
          port: 9011,
          base: 'public',
          keepalive: true,
          middleware: function (connect, options) {
            return [
              // Rewrite requests to root so they may be handled by router
              pushState(),

              // Serve static files
              connect.static(String(options.base))
            ];
          }
        }
      },
      spec: {
        options: {
          hostname: process.env.HOST || "127.0.0.1",
          port: 9012,
          base: '.',
          keepalive: true,
        }
      },
    },
    browserify: {
      options: {
        alias: [
          './tmp/templates.js:templates',
          './tmp/api_config.js:apiconfig',
        ],
        browserifyOptions: {
          '-d': '',
          paths: ['./app/scripts']
        },
        transform: ['coffeeify'],
        watch: true,
        keepAlive: true
      },
      dist: {
        src: './app/scripts/main.js',
        dest: './public/assets/js/{:app_name}.js'
      },
      dist_build: {
        src: './app/scripts/main.js',
        dest: './public/assets/js/{:app_name}.js',
        options: {
          watch: false,
          keepAlive: false
        }
      },
    },
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          './public/assets/css/main.css': './app/styles/main.scss'
        }
      },
      dist_build: {
        foptions: {
          style: 'compressed'
        },
        files: {
          './public/assets/css/main.min.css': './app/styles/main.scss'
        }
      }
    },
    handlebars: {
      compile: {
        options: {
          namespace: 'JST',
          commonjs: true
        },
        files: {
          "tmp/templates.js": "app/templates/**/*.hbs"
        }
      }
    },
    watch: {
      watchJS: {
        files: ['app/**/*.js', 'spec/**/*.js', 'palette/app/assets/javascript/palette/**/*.coffee'],
        tasks: ['newer:jshint']
      },
      watchTemplates: {
        files: ['app/templates/**/*.hbs'],
        tasks: ['handlebars'],
      },
      watchImages: {
        files: ['public/assets/images/**/*'],
        tasks: ['copy:images']
      }
    },
    jshint: {
      all: {
        src: ['Gruntfile.js', 'app/**/*.js'],
        options: {
          jshintrc: true
        }
      }
    },
    notify: {
      build: {
        options: {
          title: '{:app_name}',
          message: 'Build completed.'
        }
      },
      spec: {
        options: {
          title: '{:app_name}',
          message: 'Spec build completed.'
        }
      },
      style: {
        options: {
          title: '{:app_name}',
          message: 'Style build completed.'
        }
      },
      templates: {
        options: {
          title: '{:app_name}',
          message: 'Template build completed.'
        }
      }
    },
    copy: {
      images: {
        expand: true,
        cwd: 'public/assets/images/',
        src: ['**'],
        dest: 'public/assets/images/'
      },
      html: {
        expand: true,
        src: process.env.INDEX_HTML,
        rename: function(path, name) {
          return "public/index.html";
        }
      }
    },
    "file-creator": {
      "build-config": {
        "tmp/api_config.js": function(fs, fd, done) {
          var root = process.env.ROOT;
          var airbrakeApiKey = process.env.AIRBRAKE_API_KEY;
          var airbrakeProjectId = process.env.AIRBRAKE_PROJECT_ID;
          var airbrakeEnvironment = process.env.AIRBRAKE_ENVIRONMENT;
          var airbrakeShouldNotify = process.env.AIRBRAKE_SHOULD_NOTIFY === "true";

          fs.writeSync(fd, "/* Generated from Gruntfile.js */ " +
            "module.exports = { " +
              'root: "' + root + '",' +
              'airbrake: {' +
                'api_key: "' + airbrakeApiKey + '",' +
                'project_id: ' + airbrakeProjectId + ',' +
                'environment: "' + airbrakeEnvironment + '",' +
                'should_notify: ' + airbrakeShouldNotify +
              "}" +
            "};"
          );
          done();
        }
      }
    },
    concurrent: {
      development: {
        tasks: ['browserify:dist', 'watch', 'connect:development', 'connect:spec', 'sass:dist'],
        options: {
          logConcurrentOutput: true,
          // default limit is Math.max(require('os').cpus().length, 2).
          // Since vagrant only has 1 "cpu", manually set limit to actual number of tasks
          limit: 7
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-file-creator');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('build_dev', ['file-creator', 'handlebars', 'browserify:dist_build', 'copy', 'sass:dist_build']);
  grunt.registerTask('build', ['build_dev', 'uglify']);
  grunt.registerTask('server', ['build_dev', 'concurrent']);
};