export default function getRowLetterP(row: number): string {
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

//  ./\¯¯¯¯¯¯¯¯\ .
//  .\ \ \¯¯¯¯\ \.
//  . \ \ \___/ /.
//  .  \ \ ____/ .
//  .   \ \ \_/  .
//  .    \ \_\   .
//  .     \/_/   .