import { is, optimizer } from '@electron-toolkit/utils'
import { BrowserWindow, Menu, app, screen, session, shell } from 'electron'
import os from 'os'
import path, { join } from 'path'
import icon from '../../build/icon.png'
import { menu } from './app/menu'
import { store } from './app/store'
import { setZodErrorMap } from './config/zod'
import { allHandlers } from './handlers'
import { registerHandlers } from './handlers/handlers.utils'
import { updateElectronApp } from './lib/autoupdater/autoupdater'

async function loadReactDevTools() {
    let reactDevToolsPath = ''
    // on windows
    console.log(process.platform)
    if (process.platform == 'win32') {
        reactDevToolsPath = path.join(
            os.homedir(),
            '/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/6.1.0.1_0'
        )
    }

    // On linux
    if (process.platform == 'linux') {
        reactDevToolsPath = path.join(
            os.homedir(),
            '/.config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/6.1.0.1_0'
        )
    }
    // on macOS
    if (process.platform == 'darwin') {
        reactDevToolsPath = path.join(
            os.homedir(),
            '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/6.1.0.1_0'
        )
    }

    await session.defaultSession.loadExtension(reactDevToolsPath)
}

function createWindow(): void {
    const savedBounds = store.getBounds()
    const screenArea = screen.getDisplayMatching(savedBounds).workArea
    const isWindowNotFitScreen =
        savedBounds.x > screenArea.x + screenArea.width ||
        savedBounds.x < screenArea.x ||
        savedBounds.y < screenArea.y ||
        savedBounds.y > screenArea.y + screenArea.height

    setZodErrorMap() // todo: why here?

    const mainWindow = new BrowserWindow({
        width: savedBounds.width,
        height: savedBounds.height,
        minWidth: 720,
        minHeight: 320,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false, // Set to false since we're using contextIsolation
            nodeIntegration: false, // Keep this false for security
            contextIsolation: true, // Keep this true for security
            webSecurity: true // Optional but recommended
        }
    })

    mainWindow.setBounds(isWindowNotFitScreen ? store.DEFAULT_BOUNDS : savedBounds)

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.on('close', () => {
        const bounds = mainWindow.getBounds()
        store.setBounds(bounds)
    })

    mainWindow?.on('minimize', () => {
        if (mainWindow.isMinimized()) {
            mainWindow.minimize()
            if (process.platform === 'darwin') {
                app.dock.hide()
            }
        }
    })

    // Make all links open with the browser, not with the application
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
app.whenReady().then(async () => {
    // Set app user model id for windows
    app.setAppUserModelId(import.meta.env.VITE_APPID)

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    registerHandlers(allHandlers)

    createWindow()

    if (is.dev) {
        await loadReactDevTools()
    }

    if (process.platform === 'darwin') {
        app.dock.show()
    }

    // check for app updates
    updateElectronApp()

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()

            if (process.platform === 'darwin') {
                void app.dock.show()
            }
        }
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
Menu.setApplicationMenu(menu)
