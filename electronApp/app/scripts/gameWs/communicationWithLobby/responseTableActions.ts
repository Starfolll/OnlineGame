import {heroAbilityTypes} from "../../../store/actions/table/table.actions.types";
import {initialHeroTurnOptions} from "./informGameMessages.types";

export type tableActions = {
   pickHero: (heroWeight: number) => void;
   pickInitialOption: (pickedOption: initialHeroTurnOptions) => void;
   pickInitialCard: (cardInGameId: number) => void;
   builtDistrict: (cardInGameId: number) => void;
   useHeroAbility: (abilityType: heroAbilityTypes, abilityData: any) => void;
}
