module.exports = function(grunt) {

	var settings = grunt.file.readYAML('settings.yaml');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		bower: {
			install: {
				options: {
					targetDir: './src',
					cleanTargetDir: true,
					layout: 'byComponent'
				}
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
		}
	});

	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', [
		'bower:install',
		'concat:addons',
		'uglify:codemirror',
		'cssmin:codemirror'
	]);
};
