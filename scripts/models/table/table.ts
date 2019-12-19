import DB_Tables from "./db_tables";

export type tableData = {
    id: string;
    usersId: Array<string>;
};

export default class Table {
    public readonly id: string;
    public readonly usersId: Array<string>;


    constructor(data: tableData) {
        this.id = data.id;
        this.usersId = data.usersId;
    }


    public async GetUsersIdInTable(): Promise<Array<string>> {
        return await DB_Tables.GetUsersIdInTable(this.id);
    }
}