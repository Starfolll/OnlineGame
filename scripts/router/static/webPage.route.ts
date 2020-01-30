import * as core from "express-serve-static-core";
import dirPath from "../dirPaths";
import express from "express";

export default express.static(`${dirPath.webFolder}/dist/`);

export function sendWebPage(route: string, app: core.Express): void {
   app.get(route, async (req, res) => {
      res.sendFile(`${dirPath.webFolder}/index.html`);
   });
}
