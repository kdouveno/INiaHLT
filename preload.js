const { contextBridge , ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('elec', {
	openDir: () => ipcRenderer.invoke('openDir')
  // we can also expose variables, not just functions
})