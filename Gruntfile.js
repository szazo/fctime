module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      options: {
        livereload: true
      },
      css: {
        files: ['app/**/*.scss'],
        tasks: ['sass']
      },
      typescript: {
        files: ['app/**/*.ts'],
        tasks: ['ts']
      },
      html: {
        files: 'app/**/*.html'
      }
    },
    ts: {
      default: {
        tsconfig: true
        //src: 'app/**/*.ts'
      }
    },
    sass: {
      options: {
          sourceMap: true
      },
      dist: {
          files: [{
              expand: true,
              src: 'app/**/*.scss',
              ext: '.css'
          }]
      }
    },
    'http-server': {
      dev: {
        root: '.',
        port: 8282,
        runInBackground: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('default', ['ts', 'sass', 'http-server', 'watch']);
};
