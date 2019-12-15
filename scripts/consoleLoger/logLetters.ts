import getLetterRow from "./letters/getLetterRow";

export default function logLetters(message: string) {
    console.log();
    message = " " + message;
    for (let letterRow = 0; letterRow < 7; letterRow++) {
        let row = "";
        for (let i = 0; i < message.length; i++) row += getLetterRow(letterRow, message[i]);
        console.log(row);
    }
    console.log();
};