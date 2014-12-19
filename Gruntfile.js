'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            development: {
                files: {
                    "css/my-pixelart.css": "less/my-pixelart.less"
                }
            }
        },

        watch: {
            scripts: {
                files: ['less/*.less'],
                tasks: ['less']
            },
            options: {
                livereload: true,
            }
        }
    });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};
