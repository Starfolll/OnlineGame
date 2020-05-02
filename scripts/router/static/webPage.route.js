"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dirPaths_1 = __importDefault(require("../dirPaths"));
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
exports.default = express_1.default.static(`${dirPaths_1.default.webFolder}/dist/`);
function sendWebPage(route, app) {
    app.get(route, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const index = fs_1.default.readFileSync(`${dirPaths_1.default.webFolder}/dist/index.html`);
        res.header({ "Content-Type": "text/html; charset=utf-8" }).send(index.toString());
    }));
}
exports.sendWebPage = sendWebPage;
