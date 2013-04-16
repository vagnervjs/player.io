module.exports = function(grunt) {
	'use strict';
	var gruntConfig = {
		pkg: grunt.file.readJSON('package.json'),
		min: {
			dist: {
				src: ['assets/js/client.js', 'assets/js/media.js'],
				dest: 'assets/js/all.min.js'
			}
		},
		cssmin: {
			dist: {
				src: ['assets/css/style.css'],
				dest: 'assets/css/all.min.css'
			}
		},
		rsync: {
			dist: {
				src: './',
				dest: './dist',
				recursive: true,
				syncDest: true,
				exclude: ['package.json',
						  'README.md',
						  'Gruntfile.js',
						  'node_modules',
						  '.git',
						  '.gitignore',
						  'media',
						  'style.css',
						  'client.js',
						  'media.js',
						  'dist']
			},
			deploy: {
				src: './dist/',
				dest: '/var/www/player.io',
				host: 'root@vagnersantana.com',
				recursive: true,
				syncDest: true
			}
		}
	};
	grunt.initConfig(gruntConfig);

	var keys = Object.keys(gruntConfig);
	var tasks = [];

	for(var i = 1, l = keys.length; i < l; i++) {
		tasks.push(keys[i]);
	}

	grunt.loadNpmTasks('grunt-yui-compressor');
	grunt.loadNpmTasks('grunt-rsync');
	grunt.registerTask('default', tasks);
};