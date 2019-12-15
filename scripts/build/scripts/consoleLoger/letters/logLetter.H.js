"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRowLetterH(row) {
    switch (row) {
        case 0:
            return "/\\¯\\   /\\¯\\     ";
        case 1:
            return "\\ \\ \\  \\ \\ \\    ";
        case 2:
            return " \\ \\ \\__\\_\\ \\   ";
        case 3:
            return "  \\ \\  _____ \\  ";
        case 4:
            return "   \\ \\ \\___ \\ \\ ";
        case 5:
            return "    \\ \\_\\  \\ \\_\\";
        case 6:
            return "     \\/_/   \\/_/";
        default:
            return "";
    }
}
exports.default = getRowLetterH;
