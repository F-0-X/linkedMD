// import electron objects
const {app, BrowserWindow, Menu, ipcRenderer} = require('electron');
const menu = require('./menu');

// reverse a reference to window object
let window;

// wait till application started
app.on('ready', () =>{
    // create a new window
    window = new BrowserWindow({
        width:1200,
        height:600,
        webPreferences:{
            nodeIntegration:true
        }
    })

    // load window content
    window.loadFile('index.html');
});

Menu.setApplicationMenu(menu);

