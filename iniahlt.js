const { dialog } = require("electron");
const xml2js = require("xml2js").parseString;
const js2xml = new (require("xml2js").Builder);
const path = require("path");
const fs = require("fs").promises;
const jp = require("fs-jetpack");

class Iniahlt{
	config;
	dir;
	saveDir;
	constructor(){
		console.log(js2xml.buildObject({feur: {oui: [{ralalah: "no"}, "sauce"]}}));
		
	}

	async openDir () {
		const { canceled, filePaths } = await dialog.showOpenDialog({
			properties: ["openDirectory"]
		});
		if (!canceled) {
			let p = filePaths[0];
			this.dir = p;
			this.saveDir = p;
			try {
				let out = await fs.readdir(p);
				out = out.filter(e=>{
					return /\.jpg|\.jpeg|\.png/.test(e);
				});
				out.unshift(p);

				return out;
			} catch (err){
				console.log(err);
			}
		}
	}
	async saveFile (data) {
		let imgPath = path.join(data.dir, data.file);
		let xmlPath = path.join(data.dir, path.parse(data.file).name + ".xml");
		let boxes = data.labels.map(o=>{
			return {
					name: o.label,
					pose: "Unspecified",
					truncated: 0,
					difficult: 0,
					bndbox:{
						xmin: o.xmin,
						ymin: o.ymin,
						xmax: o.xmax,
						ymax: o.ymax,
					}
				};
		});
		let out = js2xml.buildObject({
			annotation: {
				folder: data.dir,
				filename: data.file,
				path: imgPath,
				source: {database: "Unknown"},
				size:{
					width: data.width,
					height: data.height,
					depth: 3
				},
				segmented:0,
				object: [...boxes]
			}
		}, {indent: "  "});
		jp.write(xmlPath, out);
	}
}
module.exports = Iniahlt;