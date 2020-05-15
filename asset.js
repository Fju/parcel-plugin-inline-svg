const { Asset } = require('parcel-bundler');
const svgo = require("svgo");

const optimizer = new svgo({
	plugins: [{
		removeDoctype: true
	},
	{
		removeComments: true
	},
	{
		removeXMLNS: true
	}
	]
});

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
