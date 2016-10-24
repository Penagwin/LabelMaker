const {app, BrowserWindow, ipcMain} = require('electron')
const fs = require('fs')
const open = require('open')
uuid = require('uuid')
app.on('ready', function(){

	let win = new BrowserWindow({title: "DevicePitstop Phone Label", width: 280, height: 213})
	win.setMenu(null);
	win.loadURL(`file://${__dirname}/index.html`)


	ipcMain.on('submit', (event, argument) => { 
		const { phone, carrier, os, storage, price } = argument;
		console.log(phone, carrier, os, storage, price )
		data = fs.readFileSync("./test.svg").toString()

		var result = data.replace(/Note 4/g, phone);
		result = result.replace(/Verizon/g, carrier);
		result = result.replace(/Android/g, os);
		result = result.replace(/32 GB/g, storage);
		result = result.replace(/30\./g, price+".");

		  fs.writeFileSync("./temp.svg", result)
let print = new BrowserWindow({width: 800, height: 600, show:false})
	print.loadURL(`file://${__dirname}/print.html`)


	print.webContents.on('did-finish-load', () => {
	  // Use default printing options
	  print.webContents.printToPDF({}, (error, data) => {
	    if (error) throw error
	    	name = `${app.getPath("temp")}/print-${uuid.v4()}.pdf`
	    fs.writeFile(name, data, (error) => {
	      if (error) throw error
	      console.log('Write PDF successfully.')
	 	 open(name)
	    })
	  })
	})




		});
	


})

