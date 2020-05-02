import * as core from "express-serve-static-core";
import dirPath from "../dirPaths";
import express from "express";
import fs from "fs";


export default express.static(`${dirPath.webFolder}/dist/`);

export function sendWebPage(route: string, app: core.Express): void {
   app.get(route, async (req, res) => {
      const index = fs.readFileSync(`${dirPath.webFolder}/dist/index.html`);
      res.header({"Content-Type": "text/html; charset=utf-8"}).send(index.toString());
   });
}
