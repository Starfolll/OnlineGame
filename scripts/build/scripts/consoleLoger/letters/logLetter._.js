"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRowLetterUnderscore(row) {
    switch (row) {
        case 4:
            return "    ____________  ";
        case 5:
            return "   /\\___________\\ ";
        case 6:
            return "   \\/___________/ ";
        default:
            return "                  ";
    }
}
exports.default = getRowLetterUnderscore;
