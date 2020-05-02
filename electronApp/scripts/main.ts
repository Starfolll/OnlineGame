import {app, BrowserWindow, ipcMain, shell} from "electron";
import * as path from "path";


let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
   mainWindow = new BrowserWindow({
      height: 600,
      webPreferences: {
         preload: path.join(__dirname, "preload.js"),
         nodeIntegration: false,
         contextIsolation: false,
      },
      width: 900,
      frame: false,
      resizable: false,
   });

   mainWindow.loadFile(path.join(__dirname, "../index.html"));
   mainWindow.webContents.openDevTools();
   mainWindow.removeMenu();
   mainWindow.setMenuBarVisibility(false);
   mainWindow.center();

   mainWindow.on("closed", () => {
      mainWindow = null;
   });
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
   if (process.platform !== "darwin") {
      app.quit();
   }
});
app.on("activate", () => {
   if (mainWindow === null) {
      createWindow();
   }
});

ipcMain.on("close-main-window", (e) => {
   mainWindow?.close();
});

ipcMain.on("minimize-main-window", (e) => {
   mainWindow?.minimize();
});

ipcMain.on("main-window-set-fullscreen", (e, state: boolean) => {
   mainWindow?.setResizable(true);
   mainWindow?.setFullScreen(state);
});

ipcMain.on("open-browser-page", (e, link: string) => {
   shell.openExternal(link);
});
