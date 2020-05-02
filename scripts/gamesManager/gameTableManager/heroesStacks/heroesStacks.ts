import {Hero} from "./hero";

import {Assassin} from "./DefaultHeroStack/Assassin";
import {Thief} from "./DefaultHeroStack/Thief";
import {Magician} from "./DefaultHeroStack/Magician";
import {King} from "./DefaultHeroStack/King";
import {Bishop} from "./DefaultHeroStack/Bishop";
import {Merchant} from "./DefaultHeroStack/Merchant";
import {Architect} from "./DefaultHeroStack/Architect";
import {Condottier} from "./DefaultHeroStack/Condottier";

export class HeroesStacks {
    static get defaultStack(): { [heroesWeight: number]: Hero } {
        return {
            1: new Assassin(),
            2: new Thief(),
            3: new Magician(),
            4: new King(),
            5: new Bishop(),
            6: new Merchant(),
            7: new Architect(),
            8: new Condottier(),
        };
    }
}