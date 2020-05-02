import React from "react";
import {useSelector} from "react-redux";
import {playerInfo} from "../../../../../store/actions/table/table.actions.types";
import {rootReducerTypes} from "../../../../../store/reducers";
import GapContainer from "../../../gapContainer/GapConteiner";
import SectionCover from "../../../sectionCover/SectionCover";


export default function HeroAbilityOverlayChangeHand() {
   const gameTable = useSelector((state: rootReducerTypes) => state.gameTable);

   const changeHand = (playerId: string) => gameTable.actions.useHeroAbility("changeHand", {
      messageType: "changeHand", playerId
   });

   return (
      <GapContainer>
         {gameTable.table.players.map((p: playerInfo) => <SectionCover key={p.user.id}>
            <GapContainer>
               <div onClick={() => changeHand(p.user.id)}>
                  {p.user.publicName}
               </div>
            </GapContainer>
         </SectionCover>)}
      </GapContainer>
   );
}
