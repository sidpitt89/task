module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    react: {
        single_file_output: {
          options:{
              sourceMap:false,
              es6module:true,
          },
          files: {
            'src/gen/main.js': 'src/jsx/main.jsx'
          }
        }
    },
    babel: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'src/gen/main.es5.js': 'src/gen/main.js'
            }
        }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'css/styles.min.css': 'css/styles.css'
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/gen/main.es5.js',
        dest: 'build/main.es5.min.js'
      }
    },
    connect: {
      server: {
        options: {
          keepalive: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['cssmin', 'react', 'babel', 'uglify', 'connect']);

};