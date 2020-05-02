"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRowLetterE(row) {
    switch (row) {
        case 0:
            return "    /\\¯¯\\        ";
        case 1:
            return "    \\ \\  \\       ";
        case 2:
            return " ____\\_\\  \\_____ ";
        case 3:
            return "/\\______    ____\\";
        case 4:
            return "\\/_____/ \\  \\___/";
        case 5:
            return "        \\ \\__\\   ";
        case 6:
            return "         \\/__/   ";
        default:
            return "";
    }
}
exports.default = getRowLetterE;
