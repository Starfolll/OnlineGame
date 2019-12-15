export default function getRowLetterV(row: number): string {
    switch (row) {
        case 0:
            return "/\\¯\\       /¯/¯/";
        case 1:
            return "\\ \\ \\     / / / ";
        case 2:
            return " \\ \\ \\   / / /  ";
        case 3:
            return "  \\ \\ \\ / / /   ";
        case 4:
            return "   \\ \\ \\_/ /    ";
        case 5:
            return "    \\ \\___/     ";
        case 6:
            return "     \\/__/      ";
        default:
            return "";
    }
}

//  ./\¯\       /¯/¯/.
//  .\ \ \     / / / .
//  . \ \ \   / / /  .
//  .  \ \ \ / / /   .
//  .   \ \ \_/ /    .
//  .    \ \___/     .
//  .     \/__/      .