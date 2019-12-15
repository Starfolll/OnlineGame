export default function getRowLetterD(row: number): string {
    switch (row) {
        case 0:
            return "/\\¯¯¯¯¯¯¯¯\\   ";
        case 1:
            return "\\ \\ \\¯¯¯¯\\ \\  ";
        case 2:
            return " \\ \\ \\    \\ \\ ";
        case 3:
            return "  \\ \\ \\    \\ \\";
        case 4:
            return "   \\ \\ \\___/ /";
        case 5:
            return "    \\ \\_____/ ";
        case 6:
            return "     \\/____/  ";
        default:
            return "";
    }
}

//  ./\¯¯¯¯¯¯¯¯¯¯¯\   .
//  .\ \ \¯¯¯¯¯¯ \ \  .
//  . \ \ \       \ \ .
//  .  \ \ \       \ \.
//  .   \ \ \______/ /.
//  .    \ \________/ .
//  .     \/_______/  .