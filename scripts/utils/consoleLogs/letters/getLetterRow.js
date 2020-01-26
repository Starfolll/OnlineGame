"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logLetter_H_1 = __importDefault(require("./logLetter.H"));
const logLetter_I_1 = __importDefault(require("./logLetter.I"));
const logLetter_O_1 = __importDefault(require("./logLetter.O"));
const logLetter_L_1 = __importDefault(require("./logLetter.L"));
const logLetter_E_1 = __importDefault(require("./logLetter.E"));
const logLetter_D_1 = __importDefault(require("./logLetter.D"));
const logLetter_V_1 = __importDefault(require("./logLetter.V"));
const logLetter_P_1 = __importDefault(require("./logLetter.P"));
const logLetter_R_1 = __importDefault(require("./logLetter.R"));
const logLetter__1 = __importDefault(require("./logLetter.!"));
const logLetter__2 = __importDefault(require("./logLetter.+"));
const logLetter__3 = __importDefault(require("./logLetter._"));
const letters = {
    "H": logLetter_H_1.default,
    "O": logLetter_O_1.default,
    "I": logLetter_I_1.default,
    "L": logLetter_L_1.default,
    "E": logLetter_E_1.default,
    "D": logLetter_D_1.default,
    "P": logLetter_P_1.default,
    "V": logLetter_V_1.default,
    "R": logLetter_R_1.default,
    "!": logLetter__1.default,
    "+": logLetter__2.default,
    "_": logLetter__3.default,
    " ": () => "          ",
};
function getLetterRow(letterRow, letter) {
    letter = letter.toUpperCase();
    if (!letters[letter])
        return "";
    return letters[letter](letterRow);
}
exports.default = getLetterRow;
