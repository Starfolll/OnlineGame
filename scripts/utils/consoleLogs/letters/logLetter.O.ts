export default function getRowLetterO(row: number): string {
    switch (row) {
        case 0:
            return "/\\¯¯¯¯¯¯¯¯¯\\     ";
        case 1:
            return "\\ \\ \\¯¯¯¯¯\\ \\    ";
        case 2:
            return " \\ \\ \\¯¯¯\\ \\ \\   ";
        case 3:
            return "  \\ \\ \\   \\ \\ \\  ";
        case 4:
            return "   \\ \\ \\___\\_\\ \\ ";
        case 5:
            return "    \\ \\_________\\";
        case 6:
            return "     \\/_________/";
        default:
            return "";
    }
}

///\¯¯¯¯¯¯¯¯\
//\ \ \¯¯¯¯\ \
// \ \ \¯¯\ \ \
//  \ \ \  \ \ \
//   \ \ \__\_\ \
//    \ \________\
//     \/________/