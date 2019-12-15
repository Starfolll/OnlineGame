export default function getRowLetterII(row: number): string {
    switch (row) {
        case 0:
            return "/\\¯\\     ";
        case 1:
            return "\\ \\ \\    ";
        case 2:
            return " \\ \\ \\   ";
        case 3:
            return "  \\ \\_\\  ";
        case 4:
            return "   \\/_/  ";
        case 5:
            return "     /\\¯\\";
        case 6:
            return "     \\/_/";
        default:
            return "";
    }
}