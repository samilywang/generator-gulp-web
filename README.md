# Getting Started

## Install

Please ensure that you have installed node, yo.

Then, run

	npm install -g generator-gulp-web
	
## Usage
First run

	yo gulp-web
	
Enter a cool app name, then cd into the project.

Run
	
	npm install & bower install
	
to install dependencies

## The command of gulp:
	
	gulp 		//build the project in debug mode
				//the result will be put into .tmp directory
				//then run a sync server based on it for debug
	gulp -d		//the same to gulp
	gulp -p		//build the project in product mode
				//the result will be put into www directory
				//run a sync server based on it for debug
	gulp build	//build the project in product mode
				//the result will be put into www directory
	
## Todo list(UnRealized)
* Add sass part
* Improve jshint part
* Remain to add