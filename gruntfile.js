/*jshint node:true*/
module.exports = function(grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');

    grunt.initConfig({
        copy: {
            main: {
                files: [
                    { expand: true, cwd: 'src', src: ['error-handler.js'], dest: 'dist' }
                ]
            }
        },
        jshint: {
            main: {
                options: {
                    jshintrc: true
                },
                files: [
                    { expand: true, cwd: 'src', src: ['error-handler.js'] }
                ]
            }
        },
        uglify: {
            main: {
                options: {
                    mangle: true,
                    compress: true
                },
                files: {
                    'dist/error-handler.min.js': 'src/error-handler.js'
                }
            }
        },
        watch: {
            main: {
                files: ['src/error-handler.js'],
                tasks: ['jshint', 'copy', 'uglify']
            },
            karma: {
                files: ['src/error-handler.js', 'test/unit/**/*.js'],
                tasks: ['karma']
            }
        },
        karma: {
            main: {
                options: {
                    configFile: 'karma.conf.js'
                }
            }
        }
    });

    grunt.registerTask('default', ['jshint', 'copy', 'uglify', 'karma']);
};
