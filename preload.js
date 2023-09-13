const { contextBridge , ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('elec', {
	openDir: () => ipcRenderer.invoke('openDir'),
	saveFile: (data) => ipcRenderer.invoke('saveFile', data),
	openFile: (fileName) => ipcRenderer.invoke('openFile', fileName),
  // we can also expose variables, not just functions
})