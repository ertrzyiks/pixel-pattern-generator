'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        meta: {
            codeStyle: [
                'src/**/*.js',
                'tasks/**/*.js'
            ]
        },

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

        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'Safari 5']
            },
            angular_material: {
                src: 'bower_components/angular-material/angular-material.min.css',
                dest: 'docs/css/angular-material.0.7.0.min.css'
            }
        },

        clean: {
            docs_api: ['docs/api/']
        },

        connect: {
            test : {
                port : 8000
            }
        },

        copy: {
            less: {
                expand: true,
                cwd: 'src/',
                src: 'less/**',
                dest: 'dist/'
            }
        },

        changelog: {
            options: {}
        },

        jasmine: {
            options: {
                specs: 'spec/less/*.spec.js',
                helpers: [
                    'spec/helpers/*.js'
                ],
                host: 'http://localhost:8000/'
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

        jscs: {
            options: {
                config: ".jscsrc"
            },
            test: {
                files: {
                    src: '<%= meta.codeStyle %>'
                }
            }
        },

        jsduck: {
            main: {
                src: [
                    'src/js/*.js'
                ],

                dest: 'docs/api',

                options: {
                    'builtin-classes': false,
                    'ignore-global': true,
                    'export': 'full',
                    'pretty-json': true,
                    'no-source': true
                }
            }
        },

        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            test: {
                files:{
                    src: '<%= meta.codeStyle %>'
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
            },

            docs_api: {
                options: {
                    data: function () {
                        var api = [];

                        api.push(require('./docs/api/PPG.json'));
                        api.push(require('./docs/api/PPG.dom.json'));
                        api.push(require('./docs/api/PPG.util.json'));
                        api.push(require('./docs/api/Fallback.json'));

                        return {
                            api: api
                        };
                    }
                },
                files: {
                    'docs/app/templates/api/js.html': ['docs/app/templates/api/js.html.tmpl']
                }
            }
        },

        'saucelabs-jasmine': {
            fallback: {
                options: {
                    username: 'ertrzyiks-ppg',
                    key: process.env.SAUCE_ACCESS_KEY,
                    urls: ['http://localhost:8000/spec/js/index.html'],
                    maxPollRetries: 20,
                    testname: 'Pixel Pattern Generator fallback tests',
                    onTestComplete: function (data, done) {
                        grunt.log.writeln();
                        grunt.log.writeln();

                        if (!data.result) {
                            grunt.log.writeln(JSON.stringify(data, null, 4));
                            return;
                        }

                        data.result.suites.forEach(function (suite) {
                            grunt.log.subhead(suite.description);

                            suite.specs.forEach(function (spec) {
                                if (spec.passed) {
                                    grunt.log.writeln('* ' + spec.description)
                                } else {
                                    grunt.log.error(spec.description);

                                    spec.failures.forEach(function (failure) {
                                        grunt.log.writeln(failure.message);
                                    });
                                }
                            });
                        });

                        if (data.passed) {
                            grunt.log.ok('passed');
                        } else {
                            grunt.log.error('failed');
                        }

                        done();
                    },
                    browsers: [{
                        browserName: 'internet explorer',
                        version: '8',
                        platform: 'XP'
                    },{
                        browserName: 'internet explorer',
                        version: '9',
                        platform: 'win7'
                    },{
                        browserName: 'internet explorer',
                        version: '10',
                        platform: 'win7'
                    },{
                        browserName: 'chrome',
                        version: '39',
                        platform: 'win7'
                    },{
                        browserName: 'firefox',
                        version: '34',
                        platform: 'win7'
                    },{
                        browserName: 'opera',
                        version: '12',
                        platform: 'win7'
                    }],
                    build: process.env.CI_BUILD_NUMBER
                }
            }
        },

        uglify: {
            options: {
                sources: [
                    'src/js/ns.js',
                    'src/js/util.js',
                    'src/js/support.js',
                    'src/js/dom.js',
                    'src/js/fallback.js'
                ]
            },

            prod: {
                files: {
                    'dist/js/pixel-pattern-generator.min.js': '<%= uglify.options.sources %>'
                }
            },
            dev: {
                options: {
                    mangle: false,
                    compress: false,
                    beautify: true
                },
                files: {
                    'dist/js/pixel-pattern-generator.js': '<%= uglify.options.sources %>'
                }
            },
            angulartics: {
                files: {
                    'docs/js/angulartics.custom.min.js': [
                        'bower_components/angulartics/src/angulartics.js',
                        'bower_components/angulartics/src/angulartics-ga.js'
                    ]
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

    grunt.registerTask('build', [
        'copy:less',
        'uglify'
    ]);

    grunt.registerTask('cs', [
        'jscs',
        'jshint'
    ]);

    grunt.registerTask('test', [
        'cs',
        'build',
        'connect',
        'jasmine',
        'saucelabs-jasmine'
    ]);

    grunt.registerTask('test:less', [
        'build',
        'connect',
        'jasmine'
    ]);

    grunt.registerTask('test:js', [
        'build',
        'connect',
        'saucelabs-jasmine'
    ]);

    grunt.registerTask('build-api-docs', [
        'jsduck',
        'render:docs_api',
        'clean:docs_api'
    ]);

    grunt.registerTask('build-docs', [
        'less',
        'uglify:angulartics',
        'autoprefixer:angular_material',
        'marked-material',
        'render:docs_globals',
        'build-api-docs'
    ]);

    grunt.registerTask('_release', [
        'build',
        'build-docs',
        'changelog',
        'push-commit',
        'buildcontrol:pages'
    ]);

    grunt.registerTask('release', [
        'push::bump-only',
        '_release'
    ]);

    grunt.registerTask('release-minor', [
        'push:minor:bump-only',
        '_release'
    ]);
};
