import React from "react";
import {heroInfo} from "../../../../../store/actions/table/table.actions.types";
import GapContainer from "../../../gapContainer/GapConteiner";
import SectionCover from "../../../sectionCover/SectionCover";


export default function Hero(props: {
   hero: heroInfo
}) {
   return (
      <SectionCover>
         <GapContainer padding={"5px"} gap={"5px"}>
            <div>{props.hero.weight}</div>
            <div>Name : {props.hero.name}</div>
            <div>Ability : {props.hero.ability}</div>
            <div>Buffs : {props.hero.buffs.join(" ")}</div>
            <div>Debuffs : {props.hero.debuffs.join(" ")}</div>
         </GapContainer>
      </SectionCover>
   );
}
