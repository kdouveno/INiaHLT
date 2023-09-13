const { app, BrowserWindow, ipcMain } = require('electron')
const Iniahlt = new (require("./iniahlt.js"))();
const path = require("path");


const createWindow = () => {
	const win = new BrowserWindow({
	  width: 800,
	  height: 600,
	  webPreferences: {
		preload: path.join(__dirname, 'preload.js')
	  }
	})
  
	win.loadFile('index.html')
  }
  app.whenReady().then(() => {
	ipcMain.handle('openDir', ()=>Iniahlt.openDir());
	ipcMain.handle('saveFile', (e, labels)=>Iniahlt.saveFile(labels));
	createWindow();

  })
  app.on('window-all-closed', () => {
	app.quit()
  })



ipcMain.on("openFolder", e=>{
	console.log(e, "openFolder");
});