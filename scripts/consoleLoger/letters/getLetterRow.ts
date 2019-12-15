import getRowLetterH from "./logLetter.H";
import getRowLetterI from "./logLetter.I";
import getRowLetterII from "./logLetter.!";
import getRowLetterO from "./logLetter.O";
import getRowLetterL from "./logLetter.L";
import getRowLetterE from "./logLetter.E";
import getRowLetterPlus from "./logLetter.+";
import getRowLetterUnderscore from "./logLetter._";

const letters: { [letter: string]: Function } = {
    "H": getRowLetterH,
    "O": getRowLetterO,
    "I": getRowLetterI,
    "L": getRowLetterL,
    "E": getRowLetterE,
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