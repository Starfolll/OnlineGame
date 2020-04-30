import {Grid} from "@material-ui/core";
import React from "react";
import {playerInfo} from "../../../../../store/actions/table/table.actions.types";
import GapContainer from "../../../gapContainer/GapConteiner";
import SectionCover from "../../../sectionCover/SectionCover";
import UserAccountAvatar from "../../../userAccountAvatar/UserAccountAvatar";
import BuildingCard from "./buildingCard";


export default function PlayerSection(props: {
   player: playerInfo
}) {
   return (
      <SectionCover style={{
         border: props.player.isMyTurn ? "2px solid black" : "none",
         background: props.player.connected ? "none" : "rgba(0, 0, 0, 0.1)"
      }}>
         <GapContainer padding={"5px"} gap={"8px"}>
            <Grid container spacing={1}>
               <Grid item>
                  <UserAccountAvatar
                     avatarUrlHash={props.player.user.avatarUrlHash}
                     publicName={props.player.user.publicName}
                  />
               </Grid>
               <Grid item>
                  {props.player.user.publicName}
               </Grid>
            </Grid>
            <Grid item>
               <Grid container spacing={1} justify={"space-around"}>
                  <Grid item>
                     Gold: {props.player.gold}
                  </Grid>
                  <Grid item>
                     Cards: {props.player.cardsAmountInHand}
                  </Grid>
               </Grid>
            </Grid>
            <Grid item>
               <GapContainer style={{
                  height: "100%",
                  alignContent: "flex-start",
                  gridTemplateColumns: "auto auto"
               }}>
                  {!!props.player.placedCards ? props.player.placedCards.map(c => <Grid item key={c.gameId}>
                     <BuildingCard card={c} small/>
                  </Grid>) : ""}
               </GapContainer>
            </Grid>
         </GapContainer>
      </SectionCover>
   );
}
