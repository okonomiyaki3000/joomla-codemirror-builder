module.exports = function(grunt) {

	var settings = grunt.file.readYAML('settings.yaml');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ['src/CodeMirror'],
		copy: {
			codemirror: {
				files: [{
					expand: true,
					cwd: 'node_modules/codemirror',
					src: ['addon/**', 'keymap/**', 'lib/**', 'mode/**', 'theme/**', 'LICENSE'],
					dest: 'src/CodeMirror'
				}]
			}
		},
		concat: {
			// Concatenate all of the addon files that we will use.
			addons: {
				files: [
					{
						src: settings.addons.js.map(function (v) {
							return './src/CodeMirror/' + v;
						}),
						dest:'./src/CodeMirror/lib/addons.js'
					},
					{
						src: settings.addons.css.map(function (v) {
							return './src/CodeMirror/' + v;
						}),
						dest: './src/CodeMirror/lib/addons.css'
					}
				]
			}

		},
		uglify: {
			// Minify JS.
			codemirror: {
				options: {
					compress: true,
					mangle: true
				},
				files: [{
					expand: true,
					matchBase: true,
					ext: '.min.js',
					cwd: './src/CodeMirror/',
					src: ['*.js', '!*.min.js'],
					dest: './src/CodeMirror/'
				}]
			}
		},
		cssmin: {
			// Minify CSS.
			codemirror: {
				files: [{
					expand: true,
					matchBase: true,
					ext: '.min.css',
					cwd: './src/CodeMirror/',
					src: ['*.css', '!*.min.css', '!theme/*.css'],
					dest: './src/CodeMirror/',
				}]
			}
		},
		'optimize-js': {
			options: {sourceMap: false},
			dist: {
				files: [{
					expand: true,
					matchBase: true,
					ext: '.min.js',
					cwd: './src/CodeMirror/',
					src: ['*.min.js'],
					dest: './src/CodeMirror/',
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-npm-install');
	grunt.loadNpmTasks('grunt-optimize-js');


	grunt.registerTask('installcm', ['npm-install:codemirror']);
	grunt.registerTask('default', [
		'installcm',
		'clean',
		'copy:codemirror',
		'concat:addons',
		'uglify:codemirror',
		'optimize-js',
		'cssmin:codemirror'
	]);
};
