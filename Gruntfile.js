'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        buildcontrol: {
            options: {
                dir: 'docs',
                commit: true,
                push: true,
                message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
            },
            pages: {
                options: {
                    remote: '<%= pkg.repository.url %>',
                    branch: 'gh-pages'
                }
            }
        },

        changelog: {
            options: {}
        },

        less: {
            development: {
                files: {
                    "docs/css/sch-pixel-pattern.css": "docs/less/sch-pixel-pattern.less"
                }
            }
        },


        'marked-material': {
            readme: {
                files:{
                    'docs/app/templates/home.html': 'README.md'
                }
            }
        },

        push: {
            options: {
                files: ['package.json'],
                updateConfigs: ['pkg'],
                add: true,
                addFiles: ['.'],
                commitFiles: ['-a'],
                pushTo: 'origin'
            }
        },

        watch: {
            scripts: {
                files: ['docs/less/*.less'],
                tasks: ['less']
            },
            options: {
                livereload: true
            }
        }
    });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    require('./tasks/marked_material.js')(grunt);

    grunt.registerTask('build-docs', [
        'less',
        'marked-material'
    ]);

    grunt.registerTask('release', [
        'build-docs',
        'push::bump-only',
        'changelog',
        'push-commit',
        'buildcontrol:pages'
    ]);
};
