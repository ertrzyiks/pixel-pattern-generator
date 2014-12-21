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

        connect: {
            test : {
                port : 8000
            }
        },

        changelog: {
            options: {}
        },

        jasmine: {
            options: {
                src: 'src/**/*.js',
                specs: 'spec/**/*.spec.js',
                helpers: 'spec/helpers/*.js',
                host: 'http://127.0.0.1:8000/',
            },

            'less-1.6.0': {
                options: {
                    vendor: [
                        'bower_components/less-1.7.5/dist/less-1.6.0.js'
                    ]
                }
            },

            'less-1.7.5':{
                options: {
                    vendor: [
                        'bower_components/less-1.7.5/dist/less-1.7.5.js'
                    ]
                }
            },

            'less-2.0.0':{
                options: {
                    vendor: [
                        'bower_components/less-2.0.0/dist/less.js'
                    ]
                }
            }
        },

        less: {
            development: {
                files: {
                    "docs/css/pixel-pattern-1.css": "docs/less/pixel-pattern-1.less",
                    "docs/css/pixel-pattern-2.css": "docs/less/pixel-pattern-2.less",
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
                files: ['package.json', 'bower.json'],
                updateConfigs: ['pkg'],
                add: true,
                addFiles: ['.'],
                commitFiles: ['-a'],
                pushTo: 'origin'
            }
        },

        render: {
            docs_globals: {
                options: {
                    data: {
                        version: '<%= pkg.version %>'
                    }
                },
                files: {
                    'docs/app/globals.js': ['docs/app/globals.js.tmpl']
                }
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

    grunt.registerTask('test', [
        'connect',
        'jasmine'
    ]);

    grunt.registerTask('build-docs', [
        'less',
        'marked-material',
        'render:docs_globals'
    ]);

    grunt.registerTask('release', [
        'push::bump-only',
        'build-docs',
        'changelog',
        'push-commit',
        'buildcontrol:pages'
    ]);
};
