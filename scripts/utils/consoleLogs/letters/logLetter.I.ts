export default function getRowLetterI(row: number): string {
    switch (row) {
        case 0:
            return "/\\¯\\     ";
        case 1:
            return "\\/_/     ";
        case 2:
            return "  /\\¯\\   ";
        case 3:
            return "  \\ \\ \\  ";
        case 4:
            return "   \\ \\ \\ ";
        case 5:
            return "    \\ \\_\\";
        case 6:
            return "     \\/_/";
        default:
            return "";
    }
}