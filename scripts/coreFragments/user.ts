export default class User {
    public readonly userId: number;
    public readonly name: string;
    public readonly token: string;

    constructor(id: number, name: string, token: string) {
        this.userId = id;
        this.name = name;
        this.token = token;
    }
}