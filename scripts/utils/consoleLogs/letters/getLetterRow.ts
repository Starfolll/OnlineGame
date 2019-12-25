import getRowLetterH from "./logLetter.H";
import getRowLetterI from "./logLetter.I";
import getRowLetterO from "./logLetter.O";
import getRowLetterL from "./logLetter.L";
import getRowLetterE from "./logLetter.E";
import getRowLetterD from "./logLetter.D";
import getRowLetterV from "./logLetter.V";
import getRowLetterP from "./logLetter.P";
import getRowLetterR from "./logLetter.R";
import getRowLetterII from "./logLetter.!";
import getRowLetterPlus from "./logLetter.+";
import getRowLetterUnderscore from "./logLetter._";

const letters: { [letter: string]: Function } = {
    "H": getRowLetterH,
    "O": getRowLetterO,
    "I": getRowLetterI,
    "L": getRowLetterL,
    "E": getRowLetterE,
    "D": getRowLetterD,
    "P": getRowLetterP,
    "V": getRowLetterV,
    "R": getRowLetterR,
    "!": getRowLetterII,
    "+": getRowLetterPlus,
    "_": getRowLetterUnderscore,
    " ": () => "          ",
};

export default function getLetterRow(letterRow: number, letter: string): string {
    letter = letter.toUpperCase();

    if (!letters[letter]) return "";
    return letters[letter](letterRow);
}