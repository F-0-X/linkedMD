// import electron objects
const {app, BrowserWindow, Menu, ipcRenderer} = require('electron');
const menu = require('./menu');
const {autoUpdate} = require('electron-updater');

// reverse a reference to window object
let window;

// wait till application started
app.on('ready', () =>{
    // create a new window
    window = new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            nodeIntegration:true
        }
    })

    // load window content
    window.loadFile('index.html');
    autoUpdate.checkForUpdatesAndNotify();
});

Menu.setApplicationMenu(menu);

