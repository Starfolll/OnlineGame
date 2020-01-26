"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRowLetterL(row) {
    switch (row) {
        case 0:
            return "/\\¯\\          ";
        case 1:
            return "\\ \\ \\         ";
        case 2:
            return " \\ \\ \\        ";
        case 3:
            return "  \\ \\ \\       ";
        case 4:
            return "   \\ \\ \\_____ ";
        case 5:
            return "    \\ \\______\\";
        case 6:
            return "     \\/______/";
        default:
            return "";
    }
}
exports.default = getRowLetterL;
