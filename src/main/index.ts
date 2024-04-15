import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const Store = require('electron-store')
// Create a new instance of electron-store
const store = new Store()
function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,

    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.maximize();
  })

  ipcMain.handle('QR-Generate', async (event,args) => {
    console.log('QR generated here', args)
    let list = await getPrinters(mainWindow)
    console.log('All printer available are ', list[0])
    if(list[0].name === 'Microsoft Print to PDF'){
      console.log('PDF printer available')
      event.sender.send('print-error', ' No Real PDF printer available')
      return
    }
    var options = {
      silent: true,
      printBackground: true,
      color: false,
      margin: {
        marginType: 'printableArea'
      },
      potrait: true,
      // pagesPerSheet: 1,
      fitToPage: true,
      collate: false,
      copies: 1
      // header: 'Header of the Page',
      // footer: 'Footer of the Page'
    }
    mainWindow.webContents.print(options, (success, errorType) => {
      if (!success){
        console.log(errorType)
        event.sender.send('print-error', errorType)
      }
      
      else {
        console.log('Printing done')
        event.sender.send('print-success', 'Printing done')
      }
    })
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('store',getJWT)
  ipcMain.on('user', getUser)


  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
const getPrinters = async (mainWindow) => {
  const list = await mainWindow.webContents.getPrintersAsync()
  return list
}

const getJWT =  (event) => {
  const jwt = store.get('jwtToken')
  event.reply('token-data-reply', jwt)

}
const getUser =  (event) => {
  const user = store.get('user')
  event.reply('user-data-reply', user)
}

ipcMain.handle('setToken', (args) => {
  store.set('jwtToken', args)
  console.log('Token stored in store')
})
ipcMain.handle('setUser', (args) => {
  store.set('user', args)
  console.log('User data stored in store')
})
ipcMain.handle('clearToken', () => {
  store.delete('jwtToken')
  console.log('Token data deleted from the store')
})
ipcMain.handle('clearUser', () => {
  store.delete('user')
  console.log('User data Deleted from the store')
})