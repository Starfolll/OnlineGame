import User from "../coreFragments/user";

export default class LobbyUser extends User {
    constructor(id: number, name: string) {
        super(id, name);
    }
}