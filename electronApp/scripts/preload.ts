import {ipcRenderer} from "electron";
const packageJson = require('./../package.json');


const rendererImplementFunctions = (archiveName: string, functions: { [fName: string]: any }) => {
   // @ts-ignore
   window[archiveName] = functions;
};


const closeWindow = () => ipcRenderer.send("close-main-window");
const minimizeWindow = () => ipcRenderer.send("minimize-main-window");


rendererImplementFunctions("api", {
   "closeWindow": closeWindow,
   "minimizeWindow": minimizeWindow,
});


// @ts-ignore
window["api"]["appVersion"] = packageJson.version;
