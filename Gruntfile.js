// Generated on 2013-10-10 using generator-webapp 0.4.3
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // configurable paths
        yeoman: {
            app: 'app',
            dist: 'dist'
        },
        watch: {
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer']
            },
            styles: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
                tasks: ['copy:styles', 'autoprefixer']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/**/*.html',
                    '<%= yeoman.app %>/**/*.json',
                    '.tmp/styles/**/*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/**/*.js',
                    '<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
                // hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            test: {
                options: {
                    base: [
                        '.tmp',
                        'test',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= yeoman.dist %>'
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '<%= yeoman.app %>/scripts/controllers/**/*.js',
                '<%= yeoman.app %>/scripts/models/**/*.js',
                '<%= yeoman.app %>/scripts/utils/**/*.js',
                '<%= yeoman.app %>/scripts/views/**/*.js',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    log: true,
                    run: false,
                    // reporter: 'Spec',
                    urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
                }
            }
        },
        // blanket: {
        //     options: {},
        //     files: {
        //         'scripts-cov/': ['<%= yeoman.app %>/scripts/'],
        //     },
        // },
        // blanket_mocha: {
        //     all: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html'],
        //     options: {
        //         log: true,
        //         threshold: 70
        //     }
        // },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: '<%= yeoman.app %>/bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
            dist: {}
        },*/
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    baseUrl: '<%= yeoman.app %>/scripts',
                    optimize: 'none', //'uglify2', //'none',
                    // TODO: Figure out how to make sourcemaps work with grunt-usemin
                    // https://github.com/yeoman/grunt-usemin/issues/30
                    //generateSourceMaps: true,
                    // required to support SourceMaps
                    // http://requirejs.org/docs/errors.html#sourcemapcomments
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true,
                    //uglify2: {} // https://github.com/mishoo/UglifyJS2
                }
            },
            dist2: {
                options: {
                    baseUrl: '<%= yeoman.app %>/scripts',
                    optimize: 'none',//'uglify2', //'none',
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: false,

                    name: 'issuuviewer',
                    out: '<%= yeoman.dist %>/scripts/issuuviewer.js',
                    mainConfigFile: '<%= yeoman.app %>/scripts/issuuviewer.js'
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/scripts/controllers/**/*.js',
                        '<%= yeoman.dist %>/scripts/models/**/*.js',
                        '<%= yeoman.dist %>/scripts/utils/**/*.js',
                        '<%= yeoman.dist %>/scripts/views/**/*.js',

                        '<%= yeoman.dist %>/styles/**/*.css',
                        '<%= yeoman.dist %>/images/generated/**/*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= yeoman.dist %>/styles/fonts/*'
                    ]
                }
            }
        },
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>'
            },
            html: ['<%= yeoman.app %>/index.html', '<%= yeoman.app %>/issuuviewer.html']
        },
        usemin: {
            options: {
                dirs: ['<%= yeoman.dist %>']
            },
            html: ['<%= yeoman.dist %>/**/*.html'],
            css: ['<%= yeoman.dist %>/styles/**/*.css']
        },
        imagemin: {
            dist: {
                options: {
                    cache: false
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: 'content/**/*.{png,jpg,jpeg}',
                        dest: '<%= yeoman.dist %>/images'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: 'structure/galleria/**/*.{png,jpg,jpeg}',
                        dest: '<%= yeoman.dist %>/images'
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        src: 'generated/**/*.{png,jpg,jpeg}',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '**/*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        cssmin: {
            // This task is pre-configured if you do not wish to use Usemin
            // blocks for your CSS. By default, the Usemin block from your
            // `index.html` will take care of minification, e.g.
            //
            //     <!-- build:css({.tmp,app}) styles/main.css -->
            //
            // dist: {
            //     files: {
            //         '<%= yeoman.dist %>/styles/main.css': [
            //             '.tmp/styles/{,*/}*.css',
            //             '<%= yeoman.app %>/styles/{,*/}*.css'
            //         ]
            //     }
            // }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        minjson: {
            compile: {
                files: {
                    // Minify one json file
                    '<%= yeoman.dist %>/config.json': '<%= yeoman.app %>/config.json',
                    '<%= yeoman.dist %>/hash.json': '<%= yeoman.app %>/hash.json',
                    '<%= yeoman.dist %>/data.json': '<%= yeoman.app %>/data.json'
                    // Concat/minify one.json and all json files within the data folder
                    // If more than one json file is matched, json will be wrapped in brackets []
                    //'all.min.json': ['one.json', 'data/*.json']
                }
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,png,txt,xml}',
                            '.htaccess',
                            'images/**/*.{webp,gif}',
                            'styles/fonts/*',
                            'scripts/lib/**/*',
                            'bower_components/sass-bootstrap/fonts/*.*'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>/bower_components/jquery-galleria/src/themes/classic',
                        dest: '<%= yeoman.dist %>/styles',
                        src: '*.gif'
                    }
                ]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },
        modernizr: {
            devFile: '<%= yeoman.app %>/bower_components/modernizr/modernizr.js',
            outputFile: '<%= yeoman.dist %>/bower_components/modernizr/modernizr.js',
            files: [
                '<%= yeoman.dist %>/scripts/{,*/}*.js',
                '<%= yeoman.dist %>/styles/{,*/}*.css',
                '<%= yeoman.dist %>/scripts/vendor/*'
            ],
            uglify: true
        },
        concurrent: {
            server: [
                'compass',
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist1: [
                'compass',
                'copy:styles',
                'htmlmin',
            ],
            dist2: [
                'imagemin',
                'svgmin',
                'webp'
            ]
        },
        bower: {
            options: {
                exclude: ['modernizr', 'requirejs']
            },
            all: {
                rjsConfig: ['<%= yeoman.app %>/scripts/index.js', '<%= yeoman.app %>/scripts/issuuviewer.js']
            }
        },
        manifest: {
            generate: {
                options: {
                    basePath: '<%= yeoman.dist %>',
                    // cache: [
                    //     'styles/*'
                    // ],
                    //network: '',
                    //fallback: ['/ /offline.html'],
                    //exclude: ['js/jquery.min.js'],
                    preferOnline: false,
                    verbose: true,
                    timestamp: true,
                    hash: false,
                    master: ['index.html']
                },
                src: [
                    '*.html',
                    'favicon.ico',
                    'bower_components/**/*.js',
                    'scripts/**/*.js',
                    'styles/**/*',
                    //'images/**/*.{png,jpg,jpeg,gif,webp,svg}'
                    'images/generated/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                dest: '<%= yeoman.dist %>/manifest.appcache'
            }
        },
        'ftp-deploy': {
            build: {
                auth: {
                    host: 'www.pbsputnik.ru',
                    port: 21,
                    authKey: 'key1'
                },
                src: '<%= yeoman.dist %>',
                dest: '/www',
                exclusions: [
                    '<%= yeoman.dist %>/**/.DS_Store',
                    '<%= yeoman.dist %>/**/Thumbs.db',
                    'dist/tmp'
                ]
            }
        },
        webp: {
            files: {
                expand: true,
                cwd: '<%= yeoman.app %>/images/content',
                src: '**/*.{jpg,jpeg}',
                dest: '<%= yeoman.dist %>/images/content'
            },
            options: {
                binpath: require('webp-bin').path,
                preset: 'photo',//'default', 'drawing', 'picture', 'photo',
                verbose: false,
                quality: 100,
                compressionMethod: 6,
                analysisPass: 10,
                multiThreading: true,
                lowMemory: false,
                noAlpha: true,
                lossless: false
            }
        }
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        // 'blanket',
        // 'blanket_mocha',
        'mocha',
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'jshint',
        'useminPrepare',
        'concurrent:dist1',
        'concurrent:dist2',
        'autoprefixer',
        'requirejs',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        'minjson',
        'rev',
        'usemin',
        'manifest'
        // 'modernizr'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);

    grunt.registerTask('deploy', [
        'build',
        'ftp-deploy:build'
    ]);

};
