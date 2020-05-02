"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xpPerLvl = 100;
const xpPerLvlMultiplier = 1.052;
const lvlFormulas = {
    xpToNextLvl: (currentLvl) => {
        return (xpPerLvl * (currentLvl * xpPerLvlMultiplier)) * ((xpPerLvlMultiplier * (currentLvl - 1)) + 1);
    },
};
exports.default = lvlFormulas;
