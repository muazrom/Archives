const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

let win

function createWindow() {
  win = new BrowserWindow({
    width: 680,
    height: 480,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    skipTaskbar: true,
    resizable: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  win.on('blur', () => {
    win.hide()
  })
}

function toggleWindow() {
  if (!win) return
  if (win.isVisible()) {
    win.hide()
  } else {
    win.center()
    win.show()
    win.focus()
  }
}

app.whenReady().then(() => {
  createWindow()

  globalShortcut.register('CommandOrControl+Space', toggleWindow)

  ipcMain.on('hide-window', () => win.hide())
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
