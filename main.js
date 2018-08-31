'use strict';
// Todo app powered by Electron
// You have permission to read and write to this code
// All rights are reserved to Adib Mohsin
// Licensed under MIT

const electron = require('electron');
const url = require('url');
const path = require('path');
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu
} = electron;

let mainWindow;
let aboutWindow;
let licenseWindow;

const icon = path.join(__dirname, 'note.ico');

const createAboutWindow = function () {
  aboutWindow = new BrowserWindow({
    width: 350,
    height: 200,
    maxWidth: 350,
    maxHeight: 200,
    minWidth: 350,
    minHeight: 200,
    frame: true,
    maximizable: false,
    title: "About todo app",
    icon: icon
  })

  aboutWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'about.html'),
    slashes: true,
    protocol: 'file'
  }));

  aboutWindow.setMenuBarVisibility(false);
}

const createLicenseWindow = function () {
  licenseWindow = new BrowserWindow({
    width: 350,
    height: 350,
    maxWidth: 350,
    maxHeight: 350,
    minWidth: 350,
    minHeight: 350,
    frame: true,
    maximizable: false,
    title: "Todo app license",
    icon: icon
  });

  licenseWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'license.html'),
    slashes: true,
    protocol: 'file'
  }));

  licenseWindow.setMenuBarVisibility(false);
}

const mainMenuTemplate = [{
    label: "File",
    submenu: [{
        label: "Clear completed",
        click: function () {
          mainWindow.webContents.send('removeCompleted');
        },
        accelerator: 'Ctrl+Shift+C'
      },
      {
        label: "Toggle menu",
        click: function () {
          if (mainWindow.isMenuBarVisible()) {
            mainWindow.setMenuBarVisibility(false)
          } else {
            mainWindow.setMenuBarVisibility(true)
          }
        },
        accelerator: 'Ctrl+Shift+T'
      },
      {
        label: "Quit app",
        click: function () {
          app.quit()
        },
        accelerator: 'Ctrl+Q'
      },
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: "About",
        accelerator: 'Ctrl+Shift+A',
        click() {
          createAboutWindow();
        }
      },
      {
        label: "License",
        accelerator: 'Ctrl+Shift+L',
        click() {
          createLicenseWindow();
        }
      },
    ]
  }
]

app.on('ready', function () {
  mainWindow = new BrowserWindow({
    frame: true,
    width: 350,
    height: 400,
    maxWidth: 350,
    minWidth: 300,
    maximizable: false,
    minHeight: 400,
    title: "Notes",
    icon: icon
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    slashes: true,
    protocol: 'file'
  }));

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  // Close app if mainwindow closes
  mainWindow.on('close', function () {
    app.quit();
  })
});

ipcMain.on('title:set', (_, data) => {
  mainWindow.setTitle(`Remaining - ${data}`)
});

if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer',
    submenu: [{
        label: 'Dev tools',
        click(_, window) {
          window.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}

// End here☢☢☢