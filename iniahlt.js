const { dialog } = require("electron");
const path = require("path");
const fs = require("fs").promises;

class Iniahlt{
	dir;
	fileList = {};
	config;

	constructor(){
		
	}

	async openDir () {
		const { canceled, filePaths } = await dialog.showOpenDialog({
			properties: ["openDirectory"]
		});
		if (!canceled) {
			let p = filePaths[0];

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
}
module.exports = Iniahlt;