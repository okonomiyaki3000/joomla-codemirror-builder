module.exports = function(grunt) {

	var settings = grunt.file.readYAML('settings.yaml');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		settings: settings,
		clean: {
			// Remove contents of the source and destination directories left over from previous runs.
			codemirror_folders: ['<%= settings.directories.source %>/**', '<%= settings.directories.destination %>/**'],
			// Remove any html files because we don't need them.
			codemirror_html: ['<%= settings.directories.destination %>/**/*.html']
		},
		curl: {
			// Download the distro.
			codemirror:
			{
				src: '<%= settings.CodeMirrorDistro %>',
				dest: '<%= settings.directories.source %>/codemirror.zip'
			}
		},
		unzip: {
			// Unzip the downloaded file.
			codemirror: {
				src: '<%= settings.directories.source %>/codemirror.zip',
				dest: '<%= settings.directories.source %>/'
			}
		},
		rename: {
			// The distro is named with a version number which is annoying so rename it.
			codemirror: {
				src: grunt.file.expand(settings.directories.source + '/codemirror-*').pop(),
				dest: '<%= settings.directories.source %>/codemirror'
			}
		},
		copy: {
			// Copy only the files we actually need to the destination directory.
			codemirror: {
				files: [
					{
						expand: true,
						cwd: '<%= settings.directories.source %>/codemirror/',
						src: '<%= settings.copyItems %>',
						dest: '<%= settings.directories.destination %>/'
					}
				]
			}
		},
		concat: {
			// Concatenate all of the addon files that we will use.
			codemirror: {
				files: [{
					src: settings.addons.js.map(function (v) { return '<%= settings.directories.destination %>/' + v; }),
					dest:'<%= settings.directories.destination %>/lib/addons.js'
				},
				{
					src: settings.addons.css.map(function (v) { return '<%= settings.directories.destination %>/' + v; }),
					dest: '<%= settings.directories.destination %>/lib/addons.css'
				}]
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
					cwd: '<%= settings.directories.destination %>',
					src: ['*.js', '!*.min.js'],
					dest: '<%= settings.directories.destination %>'
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
					cwd: '<%= settings.directories.destination %>',
					src: ['*.css', '!*.min.css', '!theme/*.css'],
					dest: '<%= settings.directories.destination %>'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-rename');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-curl');
	grunt.loadNpmTasks('grunt-zip');

	grunt.registerTask('default', [
		'clean:codemirror_folders',
		'curl:codemirror',
		'unzip:codemirror',
		'rename:codemirror',
		'copy:codemirror',
		'concat:codemirror',
		'clean:codemirror_html',
		'uglify:codemirror',
		'cssmin:codemirror'
	]);
};
