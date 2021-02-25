const {ipcMain, dialog} = require('electron');
const {app, Menu, shell} = require('electron');
const {BrowserWindow} = require('electron');
const {globalShortcut} = require('electron');
const fs = require('fs');

const template = [
    {
        label:'File',
        submenu:[
            {
                label:'Open',
                accelerator:'CommandOrControl+O',
                click(){
                    loadFile();
                }
            },
            {
                label:'Save',
                accelerator:'CommandOrControl+S',
                click(){
                    saveFile();
                }
            }
        ]
    }
]

if(process.platform === 'win32'){
    template.unshift({
        label:app.getName(),
        submenu:[
            {role:'about'},
            {type:'separator'},
            {role:'quit'}
        ]
    });
}

if(process.env.DEBUG){
    template.push({
        label:'Debugging',
        submenu:[
            {
                label: 'Dev Tools',
                role:'toggleDevTools'
            },
            {type:'separator'},
            {
                role:'reload',
                accelerator:'Ctrl+R'
            }
        ]
    });
}

function saveFile(){
    console.log('Saving the file');
    
    const window = BrowserWindow.getFocusedWindow();
    window.webContents.send('editor-event', 'save');
}

function loadFile(){
    const window = BrowserWindow.getFocusedWindow();

    const options = {
        title: 'Pick a markdown file',
        filters:[
            {name:'Markdown files', extensions:['md']},
            {name:'Text files', extensions:['txt']}
        ]
    };

    dialog.showOpenDialog(window, options).then(result =>{
        if(!result.canceled && result.filePaths && result.filePaths.length > 0){
            try{
                const content = fs.readFileSync(result.filePaths[0].toString(), 'utf8');
                window.webContents.send('load', content);
            }catch(err){
                console.error(err);
            }
            
        }
    });
}


app.on('ready', ()=>{
    globalShortcut.register('CommandOrControl+S', ()=>{
        saveFile();
    });

    globalShortcut.register('CommandOrControl+O', ()=>{
        loadFile();
    });
});



ipcMain.on('editor-reply', (event, arg) =>{
    console.log('Received reply from web page: ' + arg);
});

ipcMain.on('save', (event, arg) => {
    console.log('Saving content of the file');
    console.log(arg);

    const window = BrowserWindow.getFocusedWindow();
    const options = {
        title:'Save markdown file',
        filters:[
            {
                name:'MyFile',
                extensions:['md']
            }
        ]
    }
    let promise = dialog.showSaveDialog(window, options);
    promise.then(file => {
        if(!file.canceled){
            console.log(file.filePath.toString());

            fs.writeFileSync(file.filePath.toString(), arg);
        }
    })
    
    // if (!promise.canceled){
    //     let filePath = promise.filePath;
    //     console.log('just get the filepath, trying to store to disk');
    //     fs.writeFileSync(filePath, arg)
    // }
});

const menu = Menu.buildFromTemplate(template);

module.exports = menu