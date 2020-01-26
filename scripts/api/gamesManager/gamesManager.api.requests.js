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
Object.defineProperty(exports, "__esModule", { value: true });
class GamesManagerApiRequests {
    static CreateNewTable(usersIdInRoom) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch("http://games-manager:8015/api/create-new-game-table", {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({
                    usersId: usersIdInRoom
                })
            });
            return yield res.json();
        });
    }
}
exports.default = GamesManagerApiRequests;
