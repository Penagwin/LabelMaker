if (require('electron-squirrel-startup')) return;


const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs')
const open = require('open')
uuid = require('uuid')
print = null
dir = `${app.getPath("documents")}/Phone_Templates/`
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
app.on('window-all-closed', function() {
    app.quit();
});
app.on('ready', function() {

    let win = new BrowserWindow({ title: "DevicePitstop Phone Label", width: 280, height: 213 })
    win.setMenu(null);
    win.loadURL(`file://${__dirname}/index.html`)


    ipcMain.on('submit', (event, argument) => {
        const { phone, carrier, os, storage, price } = argument;
        print = new BrowserWindow({ width: 800, height: 600, show: false })
        data = fs.readFileSync(`${__dirname}/test.svg`).toString()

        var result = data.replace(/Note 4/g, phone);
        result = result.replace(/Verizon/g, carrier);
        result = result.replace(/Android/g, os);
        result = result.replace(/32 GB/g, storage);
        result = result.replace(/30\./g, price + ".");

        fs.writeFileSync(`${app.getPath("temp")}/temp.svg`, result)
        print.loadURL(`file://${__dirname}/print.html`)


        print.webContents.on('did-finish-load', () => {
            // Use default printing options
            print.webContents.printToPDF({}, (error, data) => {
                if (error) throw error
                name = `${app.getPath("documents")}/Phone_Templates/${phone}-${carrier}-${os}-${storage}-${price}.pdf`
                fs.writeFile(name, data, (error) => {
                    if (error) throw error
                    console.log('Write PDF successfully.')
                    open(name)
                    print.close()
                })
            })
        })




    });



})
