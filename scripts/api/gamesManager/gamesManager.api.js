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
const decks_1 = require("../../gamesManager/gameTableManager/deck/decks");
const heroesStacks_1 = require("../../gamesManager/gameTableManager/heroesStacks/heroesStacks");
class GamesManagerApi {
    AppBindPostCreateNewGameTable(route, app, gamesManager) {
        app.post(route, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const usersId = data.usersId;
            res.json(yield this.CreateNewGameTable({ usersId: usersId }, gamesManager));
        }));
    }
    CreateNewGameTable(tableUsers, gamesManager) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield gamesManager.CreateNewTable(tableUsers, decks_1.Decks.defaultDeck, heroesStacks_1.HeroesStacks.defaultStack));
        });
    }
}
exports.default = GamesManagerApi;
