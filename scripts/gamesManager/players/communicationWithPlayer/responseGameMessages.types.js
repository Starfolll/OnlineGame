"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var playerTurnResponse;
(function (playerTurnResponse) {
    playerTurnResponse["heroPicked"] = "heroPicked";
    playerTurnResponse["initialHeroTurnOptionPicked"] = "initialHeroTurnOptionPicked";
    playerTurnResponse["initialHeroCardPicked"] = "initialHeroCardPicked";
    playerTurnResponse["buildDistrict"] = "buildDistrict";
    playerTurnResponse["buildTurnMade"] = "buildTurnMade";
    playerTurnResponse["chatMessage"] = "chatMessage";
    playerTurnResponse["heroAbilityUsed"] = "heroAbilityUsed";
})(playerTurnResponse = exports.playerTurnResponse || (exports.playerTurnResponse = {}));
exports.initialHeroTurnOptions = new Set(["gold", "cards"]);
