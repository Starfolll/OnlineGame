"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getLetterRow_1 = __importDefault(require("./letters/getLetterRow"));
function logLetters(message) {
    console.log();
    message = " " + message;
    for (let letterRow = 0; letterRow < 7; letterRow++) {
        let row = "";
        for (let i = 0; i < message.length; i++)
            row += getLetterRow_1.default(letterRow, message[i]);
        console.log(row);
    }
    console.log();
}
exports.default = logLetters;
;
