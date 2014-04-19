'use strict';
var util 	=   require('util'),
		path 	=   require('path'),
		spawn 	= require('child_process').spawn,
		yeoman 	= require('yeoman-generator'),
		chalk 	= require('chalk'),
		_ 			= require('lodash');

var GulperGenerator = yeoman.generators.Base.extend({
	init: function () {
		this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));
		this.on('end', function () {
			if (!this.options['skip-install']) {
				this.npmInstall();
			}
		});
	},

	askFor: function () {
		var done = this.async();
		var currVersion = this.pkg.version;

		console.log(this.yeoman);
		console.log(chalk.yellow('Gulper already comes with SASS and a gulpfile.coffee'));

		var prompts = [{
			type: 'input',
			name: 'projectName',
			message: 'What would you like to call your project?'
		},{
			type: 'checkbox',
			name: 'features',
			message: 'What more would you like?',
			choices: [{
				name: 'Bootstrap',
				value: 'bootstrap',
				checked: false
			},{
				name: 'Normalize',
				value: 'normalize',
				checked: false
			},{
				name: 'Modernizr',
				value: 'modernizr',
				checked: false
			},{
				name: 'jQuery',
				value: 'jQuery',
				checked: false
			},{
				name: 'Bourbon Sass Mixins',
				value: 'bourbon',
				checked: false
			},{
				name: 'Neat Grids Sass Mixins',
				value: 'neat',
				checked: false
			}]
		},{
			type: 'input',
			name: 'googleFont',
			message: 'Include a Google Font? e.g. \'Lato:300,400\')'
		}];

		this.prompt(prompts, function (answers) {

			// convert the features array into an object
			this.features = _.zipObject(answers.features, answers.features.map(_.partial(_.identity, 1)))

			this.googleFont = answers.googleFont;
			this.projectName = answers.projectName;
			this.projectVersion = currVersion;

			done();
		}.bind(this));
	},

	app: function () {

		this.mkdir('app');
		this.mkdir('app/assets');
		this.mkdir('app/assets/styles');
		this.mkdir('app/assets/scripts');
		this.mkdir('app/assets/images');

		if (this.includeBourbon) {		
			var terminal = require('child_process').spawn('bash');
			terminal.stdout.on('data', function (data) {
			    console.log('stdout: ' + data);
			});
			terminal.on('exit', function (code) {
			    console.log('child process exited with code ' + code);
			});
			setTimeout(function() {
			    console.log('Installing Bourbon');
			    terminal.stdin.write('bourbon install --path ./app/assets/styles');
			    terminal.stdin.write('uptime\n');
			    terminal.stdin.end();
			}, 1000);
		};

		if (this.includeNeat) {		
			var terminal = require('child_process').spawn('bash');
			terminal.stdout.on('data', function (data) {
			    console.log('stdout: ' + data);
			});
			terminal.on('exit', function (code) {
			    console.log('child process exited with code ' + code);
			});
			setTimeout(function() {
			    console.log('Installing Neat');
			    terminal.stdin.write('neat install');
			    terminal.stdin.write('mv ./neat/ ./app/assets/styles/neat');
			    terminal.stdin.write('uptime\n');
			    terminal.stdin.end();
			}, 1000);
		};

		this.directory('./gulp/app','app');

		this.copy('./gulp/gulpfile.coffee','gulpfile.coffee');
		this.copy('_package.json', 'package.json');
		// this.copy('_bower.json', 'bower.json');
	},

	projectfiles: function () {
		this.copy('editorconfig', '.editorconfig');
		this.copy('jshintrc', '.jshintrc');
	}
});

module.exports = GulperGenerator;