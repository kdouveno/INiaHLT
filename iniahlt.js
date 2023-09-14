const { dialog } = require("electron");
const xml2js = new (require("xml2js").Parser)({explicitArray: false});
const js2xml = new (require("xml2js").Builder)();
const labelData = require("./scripts/labelData.js");
const path = require("path");
const fs = require("fs").promises;
const jp = require("fs-jetpack");

class Iniahlt{
	config;
	dir;
	saveDir;
	constructor(){
		
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
		let xmlPath = path.join(data.dir, this.getXML(data.file));
		if (data.labels.length == 0){
			jp.remove(xmlPath);
			return ;
		}
		let imgPath = path.join(data.dir, data.file);
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
	async openFile(fileName){
		const read = jp.read(path.join(this.dir, this.getXML(fileName)));
		if (!read)
			return read;
		const data = (await xml2js.parseStringPromise(read)).annotation;
		if (!(data.object instanceof Array))
			data.object = [data.object];
		let out = {
			dir: data.folder,
			file: data.filename,
			width: data.size.width,
			height: data.size.height,
			labels: data.object.map(o=> new labelData(
				o.name,
				parseInt(o.bndbox.xmin),
				parseInt(o.bndbox.ymin),
				parseInt(o.bndbox.xmax),
				parseInt(o.bndbox.ymax)
			))
		}
		return out;
	}
	getXML(fileName){
		return path.parse(fileName).name + ".xml";
	}
}
module.exports = Iniahlt;