const { contextBridge , ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('elec', {
	openDir: () => ipcRenderer.invoke('openDir'),
	saveFile: (data) => ipcRenderer.invoke('saveFile', data),
  // we can also expose variables, not just functions
})