"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRowLetterP(row) {
    switch (row) {
        case 0:
            return "/\\¯¯¯¯¯¯¯¯\\    ";
        case 1:
            return "\\ \\ \\¯¯¯¯\\ \\   ";
        case 2:
            return " \\ \\ \\___/ /   ";
        case 3:
            return "  \\ \\ ____/    ";
        case 4:
            return "   \\ \\ \\_/     ";
        case 5:
            return "    \\ \\_\\      ";
        case 6:
            return "     \\/_/      ";
        default:
            return "";
    }
}
exports.default = getRowLetterP;
