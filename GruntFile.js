module.exports = function(grunt) {

	var settings = grunt.file.readYAML('settings.yaml');

	grunt.initConfig({
	  pkg: grunt.file.readJSON('package.json'),
	  settings: settings,
		curl: {
			codemirror:
			{
				src: '<%= settings.CodeMirrorDistro %>',
				dest: '<%= settings.directories.source %>/codemirror.zip'
			}
		},
		unzip: {
			codemirror: {
				src: '<%= settings.directories.source %>/codemirror.zip',
				dest: '<%= settings.directories.source %>/'
			}
		},
		copy: {
			rename: {
				files: [
					{
						expand: true,
						cwd: '<%= settings.directories.source %>/',
						src: ['codemirror-*/**'],
						dest: '<%= settings.directories.source %>/codemirror/',
						rename: function (dest, src) {
							var parts = src.split('/').slice(1);
							return dest + parts.join('/');
						}
					}
				]
			},
			main: {
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
			addons: {
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

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-curl');
	grunt.loadNpmTasks('grunt-zip');

	/**
	 * The prep task removes old source and destination folders so we can start fresh on each run.
	 */
	grunt.registerTask('prep', 'Delete old folders, make new ones.', function () {
		grunt.config.requires('settings.directories.source', 'settings.directories.destination');

		var src = grunt.config.get('settings.directories.source'),
				dest = grunt.config.get('settings.directories.destination');

		if (grunt.file.exists(src)) grunt.file.delete(src, {force: true});
		if (!grunt.file.isDir(src)) grunt.file.mkdir(src);

		if (grunt.file.exists(dest)) grunt.file.delete(dest, {force: true});
		if (!grunt.file.isDir(dest)) grunt.file.mkdir(dest);
	});

	/**
	 * The nothml task removes all the .html files from the distro. We don't need them.
	 */
	grunt.registerTask('nohtml', 'Delete the index.html files.', function () {
		grunt.config.requires('settings.directories.destination');

		var dest = grunt.config.get('settings.directories.destination');

		grunt.file.expand(dest + '/**/*.html').forEach(function (path) {
			if (grunt.file.exists(path)) grunt.file.delete(path, {force: true});
		});
	});

	grunt.registerTask('default', [
		'prep',
		'curl',
		'unzip',
		'copy:rename',
		'copy:main',
		'concat',
		'nohtml',
		'uglify',
		'cssmin'
	]);
};
