import {ipcRenderer} from "electron";


const packageJson = require('./../package.json');
const rendererImplementFunctions = (archiveName: string, functions: { [fName: string]: any }) => {
   // @ts-ignore
   window[archiveName] = functions;
};


const closeWindow = () => ipcRenderer.send("close-main-window");
const minimizeWindow = () => ipcRenderer.send("minimize-main-window");
const setFullscreen = (state: boolean) => ipcRenderer.send("main-window-set-fullscreen", state);
const openBrowserPage = (link: string) => ipcRenderer.send("open-browser-page", link);


rendererImplementFunctions("api", {
   "closeWindow": closeWindow,
   "minimizeWindow": minimizeWindow,
   "setFullscreen": setFullscreen,
   "openBrowserPage": openBrowserPage
});


// @ts-ignore
window["api"]["appVersion"] = packageJson.version;
