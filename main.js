const Electron = require('electron');
const { app, BrowserWindow } = Electron;
const Path = require('path')
app.on('ready', () => {
    let win = new BrowserWindow({
        width: 500, height: 400,
        resizable: true,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true, // 允许在渲染进程使用node特性
        },
        backgroundColor: '#ffffff'
    });
    let html = Path.join(__dirname, 'src/index.html')
    win.loadURL(`file://${html}`)
    win.openDevTools();
    win.show();
})
