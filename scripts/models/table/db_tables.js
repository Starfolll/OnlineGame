"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logGameInfo_1 = __importDefault(require("../../utils/consoleLogs/logGameInfo"));
const logError_1 = __importDefault(require("../../utils/consoleLogs/logError"));
const wrappedPrisma_1 = __importDefault(require("../wrappedPrisma"));
class DB_Tables {
    static CreateNewTable(usersId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield wrappedPrisma_1.default.createTable({
                usersInGame: {
                    connect: usersId.map(uId => ({
                        id: uId
                    }))
                }
            });
            if (!res.id)
                logGameInfo_1.default(res);
            logGameInfo_1.default(`New table: ${res.id}`);
            return {
                id: res.id,
                usersId: usersId
            };
        });
    }
    static DeleteTable(tableId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield wrappedPrisma_1.default.deleteTable({ id: tableId });
            if (!res.id)
                logError_1.default(res);
        });
    }
    static GetUsersIdInTable(tableId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield wrappedPrisma_1.default.users({
                where: {
                    table: yield wrappedPrisma_1.default.table({
                        id: tableId
                    })
                }
            })).map(u => u.id);
        });
    }
    static IsTableExists(tableId) {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield wrappedPrisma_1.default.table({ id: tableId }));
        });
    }
    static GetUserTableId(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const tables = yield wrappedPrisma_1.default.tables({
                where: {
                    usersInGame_some: user
                }
            });
            if (tables.length > 0)
                return tables[0].id;
            return undefined;
        });
    }
}
exports.default = DB_Tables;
