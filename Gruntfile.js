module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> JS Build v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        compress: {
          drop_console: true
        }
      },
      build: {
        src: 'build/js/<%= pkg.name %>.js',
        dest: 'build/js/<%= pkg.name %>.js'
      },
      extras: {
        src: 'build/js/dependencies.js',
        dest: 'build/js/dependencies.js'
      }
    },
    concat: {
      options: {
        separator: '\n\n',
      },
      basic: {
        src: [
          'src/js/intro.js',
          'src/js/main.js',
          'src/js/factories/*.js',
          'src/js/filters/*.js',
          'src/js/directives/*.js',
          'src/js/controllers/*.js',
          'src/js/outro.js',
        ],
        dest: 'build/js/<%= pkg.name %>.js'
      },
      dependencies: {
        src: [
          'src/js/dependencies/angular.js',
          'src/js/dependencies/*.js',
        ],
        dest: 'build/js/dependencies.js'
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'build/index.html': 'src/index.html',
        }
      },
      dev: {
        files: {
          'build/index.html': 'src/index.html',
        }
      }
    },
    autoprefixer: {
      options: {
        cascade: false
      },
      build: {
        expand: true,
        flatten: true,
        src: 'build/css/*.css',
        dest: 'build/css/'
      },
    },
    cssmin: {
      add_banner: {
        options: {
          banner: '/* <%= pkg.name %> CSS Build v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        files: {
          'build/css/<%= pkg.name %>.css': ['src/css/*.css']
        }
      }
    },
    manifest: {
      generate: {
        options: {
          basePath: 'build',
          preferOnline: false,
          verbose: false,
          timestamp: true,
        },
        src: [
          'index.html',
          'js/*.js',
          'css/*.css',
          'fonts/*/*.eot',
          'fonts/*/*.svg',
          'fonts/*/*.ttf',
          'fonts/*/*.woff',
        ],
        dest: 'build/manifest.appcache'
      }
    },
    watch: {
      files: ['src/**'],
      tasks: ['dev'],
      options: {
        livereload: true
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path and its sub-directories
          {expand: true, cwd: 'build/', src: ['**'], dest: 'production/'},
        ]
      }
    },
    buildcontrol: {
      options: {
        dir: 'production/',
        commit: true,
        push: true,
        connectCommits: false,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      pages: {
        options: {
          remote: '<%=pkg.repository.url%>',
          branch: 'gh-pages'
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-build-control');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-manifest');

  // Default task(s).
  grunt.registerTask('default', ['dev', 'watch']);
  grunt.registerTask('dev', ['concat', 'cssmin', 'autoprefixer', 'htmlmin:dev']);
  grunt.registerTask('build', ['concat', 'uglify', 'cssmin', 'autoprefixer', 'htmlmin:dist', 'manifest']);
  grunt.registerTask('production', ['build', 'copy', 'buildcontrol:pages' ]);

};