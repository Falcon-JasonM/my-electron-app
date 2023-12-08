// import electron when the app is opened
const { app, BrowserWindow } = require('electron');
const path = require('node:path');
// function to create a window on app start
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
// once the app is launched, call the createWindow() function
app.whenReady().then(() => {
    createWindow()
// create window for iOS devices
    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});
// once the window is closed, terminate the app
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});
