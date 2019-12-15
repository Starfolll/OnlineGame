export default function getRowLetterE(row: number): string {
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

//  ./\¯¯¯¯¯¯¯¯\     .
//  .\ \ \¯¯¯¯¯/     .
//  . \ \ ¯¯¯¯¯¯¯\   .
//  .  \ \ \¯¯¯¯¯/   .
//  .   \ \ \______ .
//  .    \ \________\.
//  .     \/________/.