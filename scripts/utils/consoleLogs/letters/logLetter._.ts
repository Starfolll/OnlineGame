export default function getRowLetterUnderscore(row: number): string {
    switch (row) {
        case 4:
            return "    ____________  ";
        case 5:
            return "   /\\___________\\ ";
        case 6:
            return "   \\/___________/ ";
        default:
            return "                  ";
    }
}

//  ..
//  ..
//  ..
//  .              .
//  .   ____________ .
//  .  /\___________\.
//  .  \/___________/.