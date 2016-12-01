const electron = require('electron');

electron.app.on("ready", function () {
  var mainWindow = new electron.BrowserWindow();
  mainWindow.maximize();
  mainWindow.loadURL("file://" + __dirname + "/index.html");
  mainWindow.openDevTools();
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
});
