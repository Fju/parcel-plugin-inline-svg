const { Asset } = require('parcel-bundler');
const svgo = require("svgo");

const fs = require('fs');
const path = require('path');

function loadUserConfig() {
    var file;
	
	// try loading .config.js file	
	file = path.resolve(process.cwd(), 'inline-svg.config.js');
	if (fs.existsSync(file)) {
		return require(file);	
	}

	// try loading .config.json file
	file = path.resolve(process.cwd(), 'inline-svg.config.json');
	if (fs.existsSync(file)) {
		return JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }));
	}

    return {};
}

var config = loadUserConfig();

const optimizer = new svgo(config.svgo || {});

class InlineSVGAsset extends Asset {
	constructor(name, options) {
		super(name, options);
		this.type = 'js';
	}
	async parse(content) {
		var optimizedSvg = await optimizer.optimize(content);
		this.code = optimizedSvg.data;
	}
	generate() {
		// Send to JS bundler
		return {
			'js': "module.exports = '" + this.code.replace("'", "&#39;") + "'"
		};
	}
}

module.exports = InlineSVGAsset;
