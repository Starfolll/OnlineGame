export default function getRowLetterR(row: number): string {
    switch (row) {
        case 0:
            return "/\\¯¯¯¯¯¯¯¯\\   ";
        case 1:
            return "\\ \\ \\¯¯¯¯¯/   ";
        case 2:
            return " \\ \\ \\¯¯¯¯    ";
        case 3:
            return "  \\ \\ \\       ";
        case 4:
            return "   \\ \\ \\      ";
        case 5:
            return "    \\ \\_\\     ";
        case 6:
            return "     \\/_/     ";
        default:
            return "";
    }
}

//  ./\¯¯¯¯¯¯¯¯\.
//  .\ \ \¯¯¯¯¯/.
//  . \ \ \¯¯¯¯ .
//  .  \ \ \    .
//  .   \ \ \   .
//  .    \ \_\  .
//  .     \/_/  .