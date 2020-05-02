import {Grid} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import {useSelector} from "react-redux";
import {heroInfo, playerInfo} from "../../../../store/actions/table/table.actions.types";
import {rootReducerTypes} from "../../../../store/reducers";
import BuildingCard from "./sectionsComponents/buildingCard";
import Hero from "./sectionsComponents/hero";


const useStyles = makeStyles(theme => ({
   card: {
      "&:hover": {
         top: "-70px !important",
         zIndex: "1"
      }
   }
}));

export default function GameTableHandSection() {
   const classes = useStyles();
   const account = useSelector((state: rootReducerTypes) => state.account);
   const gameTable = useSelector((state: rootReducerTypes) => state.gameTable);
   const me: playerInfo = useSelector(
      (state: rootReducerTypes) =>
         state.gameTable.table.players.filter((u: playerInfo) => u.user.id === account.id)[0]);

   const buildCard = (cardInGameId: number) => {
      if (typeof me.buildLimit !== "undefined")
         gameTable.actions.builtDistrict(cardInGameId);
   };

   const cardsCount = me.hand!.length;
   const gap = typeof me.buildLimit !== "undefined" ? 20 : -20;
   const cardWidth = 170;
   const cardsWithSpace = cardsCount * (cardWidth + gap);
   const cardsInitialPosition = -cardsWithSpace / 2;
   // const cardRotationMax = 20;
   // const mapRotation = (index: number) => ((index * cardRotationMax * 2) / (cardsCount - 1)) - cardRotationMax;
   const getCardPosition = (index: number): { top: string, left: string, transform?: string } => {
      const cardPosition = index * (cardWidth + gap);
      return {
         left: `${cardsInitialPosition + cardPosition}px`,
         top: `${typeof me.buildLimit !== "undefined" ? -130 : 0}px`
         // transform: `rotate(${mapRotation(index)}deg)`
      };
   };

   return (
      <div style={{position: "fixed", bottom: "160px", left: "50%"}}>
         <div style={{position: "relative", top: 0, left: 0}}>
            {!!me.hand ? me.hand.map(c =>
               <Grid
                  item key={c.gameId}
                  onClick={() => buildCard(c.gameId)}
                  style={{
                     position: "absolute",
                     transition: "top 0.3s, left 0.3s",
                     ...getCardPosition(me.hand!.indexOf(c))
                  }}
                  className={typeof me.buildLimit !== "undefined" ? "" : classes.card}
               >
                  <BuildingCard card={c}/>
               </Grid>
            ) : ""}
         </div>

         <div style={{position: "fixed", bottom: "30px", left: "30px"}}>
            {!!me.pickedHeroWeight && gameTable.table.tableInfo.heroes.filter((h: heroInfo) => h.weight === me.pickedHeroWeight).length > 0 ?
               <div>
                  <Hero hero={
                     gameTable
                        .table.tableInfo.heroes
                        .filter((h: heroInfo) => h.weight === me.pickedHeroWeight)[0]
                  }/>
               </div> : ""}
         </div>

         <div style={{position: "fixed", bottom: "30px", right: "30px"}}>
            {me.abilityTurnType}
            {typeof me.buildLimit !== "undefined" ?
               <div>
                  <Button onClick={() => buildCard(-1)}>
                     Continue
                  </Button>
               </div> : ""}
         </div>
      </div>
   );
}
