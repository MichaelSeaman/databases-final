const electron = require('electron');
const sqlMethods = require('./js/sqlMethods.js')

electron.app.on("ready", function () {
  var mainWindow = new electron.BrowserWindow({
    title: "Amazon Sales Database (Beta)"
  });
  mainWindow.maximize();
  mainWindow.loadURL("file://" + __dirname + "/index.html");
  if(process.argv[2] == "debug") {
    mainWindow.openDevTools();
  }
  mainWindow.on("closed", function () {
    mainWindow = null;
    sqlMethods.endPool();
  });
});
