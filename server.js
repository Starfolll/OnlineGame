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
const dotenv_1 = __importDefault(require("dotenv"));
const logError_1 = __importDefault(require("./scripts/utils/consoleLogs/logError"));
const run_gameManager_dev_1 = __importDefault(require("./scripts/run.gameManager.dev"));
const run_lobbyManager_dev_1 = __importDefault(require("./scripts/run.lobbyManager.dev"));
const run_staticAndApiServe_dev_1 = __importDefault(require("./scripts/run.staticAndApiServe.dev"));
dotenv_1.default.config();
(() => __awaiter(void 0, void 0, void 0, function* () {
    const isDev = process.env.BUILD_MODE === "dev";
    let serverMode = "";
    for (const arg of process.argv) {
        const isArgIsServerMode = arg === "--server-mode-games-manager" ||
            arg === "--server-mode-lobby-manager" ||
            arg === "--server-mode-static-and-api-serve";
        if (isArgIsServerMode)
            if (!!serverMode) {
                logError_1.default("More than one server mode");
                return;
            }
            else
                serverMode = arg;
    }
    if (!serverMode) {
        logError_1.default("No server mode set");
        return;
    }
    switch (serverMode) {
        case "--server-mode-games-manager":
            if (isDev)
                new run_gameManager_dev_1.default();
            break;
        case "--server-mode-lobby-manager":
            if (isDev)
                new run_lobbyManager_dev_1.default();
            break;
        case "--server-mode-static-and-api-serve":
            if (isDev)
                new run_staticAndApiServe_dev_1.default();
            break;
    }
}))();
