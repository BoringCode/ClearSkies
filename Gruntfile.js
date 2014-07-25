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
        src: 'build/js/build.js',
        dest: 'build/js/build.js'
      }
    },
    concat: {
      basic: {
        src: ['src/js/main.js'],
        dest: 'build/js/<%= pkg.name %>.js'
      },
      extras: {
        src: ['src/js/angular.min.js', 'src/js/includes/*.js'],
        dest: 'build/js/build.js'
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
    cssmin: {
      add_banner: {
        options: {
          banner: '/* <%= pkg.name %> CSS Build v<%= pkg.version %> */'
        },
        files: {
          'build/css/<%= pkg.name %>.css': ['src/css/*.css']
        }
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

  // Default task(s).
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('dev', ['concat', 'cssmin', 'htmlmin:dev']);
  grunt.registerTask('build', ['concat', 'uglify', 'cssmin', 'htmlmin:dist']);
  grunt.registerTask('production', ['build', 'copy', 'buildcontrol:pages' ]);

};