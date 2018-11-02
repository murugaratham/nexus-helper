import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow | null;

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload))).catch(console.log);
};

const createWindow = async () => {
  if (process.env.NODE_ENV !== 'production') {
    await installExtensions();
  }

  win = new BrowserWindow({ width: 800, height: 600 });

  if (process.env.NODE_ENV !== 'production') {
    win.loadURL(`http://localhost:2003`);
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  // if (process.env.NODE_ENV !== 'production') {
  // Open DevTools
  //  win.webContents.openDevTools();
  // }

  win.on('closed', () => {
    win = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
// import { app, BrowserWindow } from 'electron';
// import * as path from 'path';
// require('electron-debug')();
// require('electron-reload')(__dirname);

// const isProd = process.execPath.search('electron-prebuilt') === -1;

// let mainWindow: Electron.BrowserWindow | null;
// // const isDevelopmentMode = process.env.NODE_ENV === 'development';
// const createWindow = () => {
//   // Create the browser window.
//   const browserOpts: Electron.BrowserWindowConstructorOptions = {
//     height: 600,
//     width: 800,
//     webPreferences: {
//       // disable devtools when not development mode
//       devTools: true,
//     },
//   };
//   mainWindow = new BrowserWindow(browserOpts);

//   // and load the index.html of the app.
//   mainWindow.loadFile(path.join(__dirname, '../index.html'));
//   if (!isProd) {
//     mainWindow.webContents.openDevTools();
//   }
//   // Emitted when the window is closed.
//   mainWindow.on('closed', () => {
//     // Dereference the window object, usually you would store windows
//     // in an array if your app supports multi windows, this is the time
//     // when you should delete the corresponding element.
//     mainWindow = null;
//   });
// };

// const installExtensions = async () => {
//   const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS }
// = require('electron-devtools-installer');
//   return Promise.all([installExtension(REDUX_DEVTOOLS), installExtension(REACT_DEVELOPER_TOOLS)]);
// };

// app.on('ready', async () => {
//   // if (!isProd)
//   await installExtensions();
//   createWindow();
// });

// // Quit when all windows are closed.
// app.on('window-all-closed', () => {
//   // On OS X it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// app.on('activate', () => {
//   // On OS X it"s common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (mainWindow === null) {
//     createWindow();
//   }
// });

// // In this file you can include the rest of your app"s specific main process
// // code. You can also put them in separate files and require them here.
