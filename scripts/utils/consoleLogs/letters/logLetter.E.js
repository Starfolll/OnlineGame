"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRowLetterE(row) {
    switch (row) {
        case 0:
            return "/\\¯¯¯¯¯¯¯¯\\     ";
        case 1:
            return "\\ \\ \\¯¯¯¯¯/     ";
        case 2:
            return " \\ \\ ¯¯¯¯¯¯¯\\   ";
        case 3:
            return "  \\ \\ \\¯¯¯¯¯/   ";
        case 4:
            return "   \\ \\ ¯¯¯¯¯¯¯\\ ";
        case 5:
            return "    \\ \\________\\";
        case 6:
            return "     \\/________/";
        default:
            return "";
    }
}
exports.default = getRowLetterE;
