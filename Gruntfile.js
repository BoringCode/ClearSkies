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
        src: 'dev/js/<%= pkg.name %>.js',
        dest: 'dev/js/<%= pkg.name %>.js'
      },
      extras: {
        src: 'dev/js/build.js',
        dest: 'dev/js/build.js'
      }
    },
    concat: {
      basic: {
        src: ['src/js/main.js'],
        dest: 'dev/js/<%= pkg.name %>.js'
      },
      extras: {
        src: ['src/js/angular.min.js', 'src/js/includes/*.js'],
        dest: 'dev/js/build.js'
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'dev/index.html': 'src/index.html',
        }
      },
      dev: {
        files: {
          'dev/index.html': 'src/index.html',
        }
      }
    },
    cssmin: {
      add_banner: {
        options: {
          banner: '/* <%= pkg.name %> CSS Build v<%= pkg.version %> */'
        },
        files: {
          'dev/ss/<%= pkg.name %>.css': ['src/css/*.css']
        }
      }
    },
    watch: {
      files: ['**/*'],
      tasks: ['default'],
    },
    copy: {
      main: {
        files: [
          // includes files within path and its sub-directories
          {expand: true, src: ['dev/fonts/**', 'dev/icon/*', 'dev/splash/**', 'dev/js/**', 'dev/css/**', 'dev/index.html'], dest: 'dist/'},
        ]
      }
    },
    buildcontrol: {
      options: {
        dir: 'dist',
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

  // Default task(s).
  grunt.registerTask('default', ['concat', 'cssmin', 'htmlmin:dev', 'watch']);
  grunt.registerTask('build', ['concat', 'uglify', 'cssmin', 'htmlmin:dist']);
  grunt.registerTask('dist', ['build', 'copy' ]);

};