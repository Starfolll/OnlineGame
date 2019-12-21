import DB_Tables from "../table/db_tables";

export type userUniqueData = {
    id?: string;
    name?: string;
    email?: string;
}

export type userData = {
    id: string;
    token: string;
    name: string;
    email: string;
    password: string;
    publicName: string;
    createdAt: string;
    updatedAt: string;
    lvl: number;
    xp: number;
    gold: number;
}

export type userPublicData = {
    id: string;
    publicName: string;
}

export default class User {
    public readonly id: string;
    public readonly token: string;

    public readonly name: string;
    public readonly email: string;
    public readonly password: string;

    public readonly publicName: string;

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

        this.lvl = data.lvl;
        this.xp = data.xp;
        this.gold = data.gold;
    }


    public GetUserPublicData(): userPublicData {
        return {
            id: this.id,
            publicName: this.publicName
        }
    }


    public async GetUserTableId(): Promise<string | undefined> {
        return await DB_Tables.GetUserTableId({id: this.id});
    }
}