module.exports = function(grunt) {

	// 1. All configuration goes here
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		copy : {
			main : {
				expand : true,
				cwd : 'public/static/javascripts/library/',
				src : '*.js',
				dest : 'public/build/library',
				flatten : true
			}
		},

		concat: {
			dist: {
				src: [
					'public/static/javascripts/*.js',
					'public/**/*.js', // All JS in the libs folder
					'!public/build/**/*.js',
					'!public/static/javascripts/library/*.min.js',
				],
				dest: 'public/build/virus.js',
			},
			css : {
				src : ['public/static/**/*.scss'],
				dest : 'public/build/style.scss'
			}
		},

		uglify: {
			build: {
				src: 'public/build/production.js',
				dest: 'public/build/production.min.js'
			}
		},

		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'public/build/style.css': 'public/build/style.scss'
				}
			}
		},

		autoprefixer: {
			dist: {
				files: {
					'public/build/style.css': 'public/build/style.css'
				}
			}
		},

		clean : {
			src : ['public/build']
		},

		watch: {
			scripts: {
				files: ['public/**/*.js'],
				tasks: ['concat', 'uglify'],
				options: {
					spawn: false,
					livereload: true,
				},
			},

			css: {
				files: ['public/static/**/*.scss'],
				tasks: ['concat:css', 'sass'],
				options: {
					spawn: false,
					livereload: true,
				}
			}
		},

	});

	// 3. Where we tell Grunt we plan to use this plug-in.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	// grunt.loadNpmTasks('grunt-autoprefixer');
	// grunt.loadNpmTasks('grunt-devtools');

	// 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
	grunt.registerTask('default', ['clean', 'copy:main', 'concat', 'uglify', 'sass']);

	grunt.registerTask('dev', ['default', 'watch']);

};
