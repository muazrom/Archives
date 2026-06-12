const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('archive', {
  hideWindow: () => ipcRenderer.send('hide-window'),
})
