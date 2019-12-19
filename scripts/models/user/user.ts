export type userData = {
    id: string;
    token: string;
    name: string;
    email: string;
    password: string;
    publicName: string;
    tableId: string;
    lobbyId: string;
    lvl: number;
    xp: number;
    gold: number;
}

export default class User {
    public readonly id: string;
    public readonly token: string;

    public readonly name: string;
    public readonly email: string;
    public readonly password: string;

    public readonly publicName: string;

    public readonly tableId: string;
    public readonly lobbyId: string;

    public readonly lvl: number;
    public readonly xp: number;
    public readonly gold: number;


    constructor(data: userData) {
        this.id = data.id;
        this.token = data.token;

        this.name = data.name;
        this.email = data.email;
        this.password = data.password;

        this.publicName = data.publicName;

        this.tableId = data.tableId;
        this.lobbyId = data.lobbyId;

        this.lvl = data.lvl;
        this.xp = data.xp;
        this.gold = data.gold;
    }
}