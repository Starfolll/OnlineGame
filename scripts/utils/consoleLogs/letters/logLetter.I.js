"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRowLetterI(row) {
    switch (row) {
        case 0:
            return "/\\¯\\     ";
        case 1:
            return "\\/_/     ";
        case 2:
            return "  /\\¯\\   ";
        case 3:
            return "  \\ \\ \\  ";
        case 4:
            return "   \\ \\ \\ ";
        case 5:
            return "    \\ \\_\\";
        case 6:
            return "     \\/_/";
        default:
            return "";
    }
}
exports.default = getRowLetterI;
