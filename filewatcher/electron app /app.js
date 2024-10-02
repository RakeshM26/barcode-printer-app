const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const chokidar = require('chokidar');
const printer = require('electron-printer');

const watchedFolder = 'path/to/your/folder';

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window when the dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

const watcher = chokidar.watch(watchedFolder, {
  ignored: /[\/\\]\./, // Ignore hidden files
  persistent: true,
});

watcher.on('add', async (path) => {
  if (path.endsWith('.prn')) {
    try {
      const data = await fs.promises.readFile(path, 'binary');
      await printer.print(printer.getDefaultPrinter(), {
        data,
        type: 'raw',
        name: path.replace('.prn', ''),
      });
      await fs.promises.unlink(path);
      console.log('PRN file printed and deleted:', path);
    } catch (error) {
      console.error('Error printing or deleting PRN file:', error);
    }
  }
});