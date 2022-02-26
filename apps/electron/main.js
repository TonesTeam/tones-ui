const { app, BrowserWindow } = require('electron')
//const waitPort = require('wait-port');

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600
	})
	win.loadURL('http://127.0.0.1:3000')
}

frontend = {host:'127.0.0.1',port:3000}
backend = {host:'127.0.0.1',port:3001}

app.whenReady().then(() => {
	createWindow();
})

