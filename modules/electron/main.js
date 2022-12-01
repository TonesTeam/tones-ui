const {
    app,
    BrowserWindow
} = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
        show: false,
        autoHideMenuBar: true
    })
    win.maximize();
    win.show();
    win.loadURL('http://localhost:' + process.env.ROUTER_PORT);

    const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');
    installExtension(REDUX_DEVTOOLS).then((name) => {
        console.log(`Added Extension:  ${name}`);
    })
        .catch((err) => {
            console.log('An error occurred: ', err);
        });
}
app.whenReady().then(() => {
    createWindow();
})

