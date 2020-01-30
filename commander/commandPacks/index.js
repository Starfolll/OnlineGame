"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_pack_git_1 = __importDefault(require("./commander.pack.git"));
const commander_pack_pm2_1 = __importDefault(require("./commander.pack.pm2"));
const commanderSections = {
    "git": commander_pack_git_1.default,
    "pm2": commander_pack_pm2_1.default
};
exports.default = commanderSections;
