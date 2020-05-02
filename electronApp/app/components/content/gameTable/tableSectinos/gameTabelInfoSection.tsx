import {Grid} from "@material-ui/core";
import React from "react";
import {useSelector} from "react-redux";
import {initialHeroTurnOptions} from "../../../../scripts/gameWs/communicationWithLobby/informGameMessages.types";
import {cardInfo, heroInfo, playerInfo} from "../../../../store/actions/table/table.actions.types";
import {rootReducerTypes} from "../../../../store/reducers";
import GapContainer from "../../gapContainer/GapConteiner";
import SectionCover from "../../sectionCover/SectionCover";
import HeroAbilityOverlayChangeHand from "./heroesAbilityOverlay/HeroAbilityOverlay.ChangeHand";
import BuildingCard from "./sectionsComponents/buildingCard";
import Hero from "./sectionsComponents/hero";


export default function GameTableInfoSection() {
   const gameTable = useSelector((state: rootReducerTypes) => state.gameTable);
   const account = useSelector((state: rootReducerTypes) => state.account);

   const myHeroesWeightToPickFrom = gameTable.table.players.filter((p: playerInfo) => !!p.heroesWeightToPickFrom)[0];
   const myInitialTurnOptionsToPickFrom = gameTable.table.players.filter((p: playerInfo) => !!p.initialTurnOptionsToPickFrom)[0];
   const myCardsToPickFrom = gameTable.table.players.filter((p: playerInfo) => !!p.initialTurnCardsToPickFrom)[0];
   const me: playerInfo = gameTable.table.players.filter((u: playerInfo) => u.user.id === account.id)[0];

   const pickHero = (hw: number) => gameTable.actions.pickHero(hw);
   const pickInitialTurnOption = (option: initialHeroTurnOptions) => gameTable.actions.pickInitialOption(option);
   const pickInitialTurnCard = (cardGameId: number) => gameTable.actions.pickInitialCard(cardGameId);

   return (
      <SectionCover>
         <GapContainer padding={"10px"} gap={"10px"}>
            <div>Cards left : {gameTable.table.tableInfo.cardsInDeck}</div>
            <div>Current turn type : {gameTable.table.tableInfo.currentTurnType}</div>

            <Grid container spacing={2}>
               {gameTable.table.tableInfo.heroes.map((h: heroInfo) => {
                  const isShifted = gameTable.table.tableInfo.shiftedHeroesWeight.some((sHW: number) => sHW === h.weight);
                  return (<Grid item key={h.id} style={{background: isShifted ? "rgba(0,0,0,0.2)" : "none"}}>
                     {isShifted ? "shifted" : ""}
                     <Hero hero={h}/>
                  </Grid>);
               })}
            </Grid>

            <Grid container spacing={2}>
               {!!myHeroesWeightToPickFrom ? myHeroesWeightToPickFrom.heroesWeightToPickFrom.map((w: number) => {
                  const hero = gameTable.table.tableInfo.heroes.filter((h: heroInfo) => h.weight === w)[0];
                  return (<Grid item key={hero.id} onClick={() => pickHero(w)}>
                     <Hero hero={hero}/>
                  </Grid>);
               }) : ""}
            </Grid>

            <Grid container spacing={2}>
               {!!myInitialTurnOptionsToPickFrom ? myInitialTurnOptionsToPickFrom.initialTurnOptionsToPickFrom.map((o: initialHeroTurnOptions) =>
                  <Grid item key={o} onClick={() => pickInitialTurnOption(o)}>
                     <SectionCover>
                        <GapContainer>
                           {o}
                        </GapContainer>
                     </SectionCover>
                  </Grid>
               ) : ""}
            </Grid>

            <Grid container spacing={2}>
               {!!myCardsToPickFrom ? myCardsToPickFrom.initialTurnCardsToPickFrom.map((c: cardInfo) => (
                  <Grid item key={c.gameId} onClick={() => pickInitialTurnCard(c.gameId)}>
                     <BuildingCard card={c}/>
                  </Grid>
               )) : ""}
            </Grid>

            {!!me.abilityTurnType ? (() => {
               switch (me.abilityTurnType) {
                  case "changeHand":
                     return <HeroAbilityOverlayChangeHand/>;
                  default:
                     return "????";
               }
            })() : ""}
         </GapContainer>
      </SectionCover>
   );
}
