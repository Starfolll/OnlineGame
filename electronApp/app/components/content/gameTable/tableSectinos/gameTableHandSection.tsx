import {Grid} from "@material-ui/core";
import React from "react";
import {useSelector} from "react-redux";
import {playerInfo} from "../../../../store/actions/table/table.actions.types";
import {rootReducerTypes} from "../../../../store/reducers";
import BuildingCard from "./sectionsComponents/buildingCard";


export default function GameTableHandSection() {
   const account = useSelector((state: rootReducerTypes) => state.account);
   const me: playerInfo = useSelector(
      (state: rootReducerTypes) =>
         state.gameTable.players.filter((u: playerInfo) => u.user.id === account.id)[0]);

   const hand = !!me.hand ? me.hand.map(c => ({...c, sequenceNum: 0})) : null;
   if (!!hand) for (let i = 0; i < hand.length; i++) {
      hand[i].sequenceNum = i;
   }

   const cardsCount = hand!.length;
   const gap = 0;
   const cardWidth = 170;
   const cardsWithSpace = cardsCount * (cardWidth + gap);
   const cardsInitialPosition = -cardsWithSpace / 2;
   const cardRotationMax = 20;
   const mapRotation = (index: number) => ((index * cardRotationMax * 2) / (cardsCount - 1)) - cardRotationMax;
   const getCardPosition = (index: number): { top: string, left: string, transform: string } => {
      const cardPosition = index * (cardWidth + gap);
      return {
         left: `${cardsInitialPosition + cardPosition}px`,
         top: "0",
         transform: `rotate(${mapRotation(index)}deg)`
      };
   };

   return (
      <Grid style={{position: "fixed", bottom: "160px", left: "50%"}}>
         <div style={{position: "relative", top: 0, left: 0}}>
            {!!hand ? hand.map(c =>
               <Grid
                  item key={c.gameId}
                  style={{position: "absolute", ...getCardPosition(c.sequenceNum)}}
               >
                  <BuildingCard card={c}/>
               </Grid>
            ) : ""}
         </div>
      </Grid>
   );
}
