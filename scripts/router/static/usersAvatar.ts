import express from "express";
import dirPath from "../dirPaths";

export default express.static(dirPath.userAvatarsFolder);