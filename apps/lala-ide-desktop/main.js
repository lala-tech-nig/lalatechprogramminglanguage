
const { app, BrowserWindow, Menu, dialog, shell, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');
const store = new Store();

let mainWindow;

function createWindow() {
  const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width:  Math.min(1400, width),
    height: Math.min(900, height),
    minWidth:  800,
    minHeight: 600,
    title: 'LALA IDE',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    backgroundColor: '#1e1e1e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,          // allow local file:// loads
      allowRunningInsecureContent: true,
    },
    icon: path.join(__dirname, 'build-assets',
      process.platform === 'win32'  ? 'icon.ico' :
      process.platform === 'darwin' ? 'icon.icns' : 'icon.png'),
  });

  // Load the shared web IDE
  const idePath = path.join(__dirname, '..', '..', 'website', 'client', 'code-editor.html');
  mainWindow.loadFile(idePath);

  if (process.argv.includes('--inspect')) mainWindow.webContents.openDevTools();
  mainWindow.on('closed', () => { mainWindow = null; });

  // Persist window size
  const bounds = store.get('windowBounds');
  if (bounds) mainWindow.setBounds(bounds);
  mainWindow.on('resize', () => store.set('windowBounds', mainWindow.getBounds()));
  mainWindow.on('move',   () => store.set('windowBounds', mainWindow.getBounds()));
}

function buildMenu() {
  const isMac = process.platform === 'darwin';
  const exec = (js) => mainWindow?.webContents.executeJavaScript(js);
  const template = [
    ...(isMac ? [{ label: app.name, submenu: [
      { role: 'about' }, { type: 'separator' }, { role: 'services' },
      { type: 'separator' }, { role: 'hide' }, { role: 'hideOthers' },
      { type: 'separator' }, { role: 'quit' }
    ]}] : []),
    { label: 'File', submenu: [
      { label: 'New File',   accelerator: 'CmdOrCtrl+N',     click: () => exec('IDE?._openNewFileModal()') },
      { label: 'Open File',  accelerator: 'CmdOrCtrl+O',     click: () => exec('document.getElementById("open-file-input")?.click()') },
      { type: 'separator' },
      { label: 'Save',       accelerator: 'CmdOrCtrl+S',     click: () => exec('IDE?._save()') },
      { label: 'Save All',   accelerator: 'CmdOrCtrl+Alt+S', click: () => exec('IDE?._saveAll()') },
      { type: 'separator' },
      { label: 'Download ZIP', click: () => exec('IDE?._downloadAllZip()') },
      { label: 'Extract ZIP',  click: () => exec('document.getElementById("zip-extract-input")?.click()') },
      { type: 'separator' },
      { label: 'Sync to Cloud', click: () => exec('IDE?._syncToCloud()') },
      { type: 'separator' },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]},
    { label: 'Edit', submenu: [
      { role: 'undo' }, { role: 'redo' }, { type: 'separator' },
      { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' },
      { type: 'separator' },
      { label: 'Find',             accelerator: 'CmdOrCtrl+F',   click: () => exec('IDE?._openFind()') },
      { label: 'Toggle Comment',   accelerator: 'CmdOrCtrl+/',   click: () => exec('IDE?._toggleComment()') },
      { label: 'Format Document',  accelerator: 'Alt+Shift+F',   click: () => exec('IDE?._formatDoc()') },
    ]},
    { label: 'View', submenu: [
      { label: 'Toggle Sidebar',  accelerator: 'CmdOrCtrl+B', click: () => exec('IDE?._toggleSidebar()') },
      { label: 'Toggle Panel',    accelerator: 'CmdOrCtrl+J', click: () => exec('IDE?._togglePanel()') },
      { label: 'Toggle Minimap',  click: () => exec('IDE?._toggleMinimap()') },
      { type: 'separator' },
      { label: 'Zoom In',   accelerator: 'CmdOrCtrl+=', click: () => exec('IDE?._setZoom(IDE.zoom+0.1)') },
      { label: 'Zoom Out',  accelerator: 'CmdOrCtrl+-', click: () => exec('IDE?._setZoom(IDE.zoom-0.1)') },
      { label: 'Reset Zoom',accelerator: 'CmdOrCtrl+0', click: () => exec('IDE?._setZoom(1)') },
      { type: 'separator' },
      { role: 'toggleDevTools' }, { role: 'reload' }, { role: 'togglefullscreen' }
    ]},
    { label: 'Run', submenu: [
      { label: 'Run File',     accelerator: 'CmdOrCtrl+Enter', click: () => exec('IDE?._runFile()') },
      { label: 'Web Preview',  click: () => exec('IDE?._activateWebPreview()') },
      { label: 'Clear Output', click: () => exec('IDE?._clearOutput()') },
    ]},
    { label: 'Help', submenu: [
      { label: 'Documentation', click: () => shell.openExternal('https://lala-lang.dev/docs') },
      { label: 'GitHub',        click: () => shell.openExternal('https://github.com/lala-lang/lala') },
      { type: 'separator' },
      { label: 'About LALA IDE', click: () => dialog.showMessageBox(mainWindow, {
          type: 'info', title: 'LALA IDE', icon: path.join(__dirname,'build-assets','icon.ico'),
          message: 'LALA IDE v2.0',
          detail: 'VS Code-style multilingual code editor\nSupports LALA, Python, JavaScript, HTML, CSS\n\nBuilt with Electron, MongoDB & Express'
        })
      }
    ]}
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  createWindow();
  buildMenu();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

ipcMain.handle('get-platform', () => process.platform);
ipcMain.handle('open-external', (_, url) => shell.openExternal(url));
