const {
    app,
    BrowserWindow
} = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1366,
        height: 768
    })
    win.loadURL('http://localhost:' + process.env.ROUTER_PORT)
}
app.whenReady().then(() => {
    createWindow();
})