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
Object.defineProperty(exports, "__esModule", { value: true });
const process_dev_1 = require("./scripts/process.dev");
const process_prod_1 = require("./scripts/process.prod");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const webPort = +process.env.npm_package_config_webPort;
    const gameWSPort = +process.env.npm_package_config_gameWSPort;
    const isDev = process.argv.some(arg => arg === "--dev");
    if (isDev)
        yield process_dev_1.runDevelopmentBuild(webPort, gameWSPort);
    else
        yield process_prod_1.runProductionBuild(webPort, gameWSPort);
}))();
