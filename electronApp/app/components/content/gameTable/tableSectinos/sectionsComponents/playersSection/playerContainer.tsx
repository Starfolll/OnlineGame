import React from "react";
import {playerInfo} from "../../../../../../store/actions/table/table.actions.types";
import GapContainer from "../../../../gapContainer/GapConteiner";
import SectionCover from "../../../../sectionCover/SectionCover";


export default function PlayerContainer(params: {
   player: playerInfo
}) {

   return (
      <SectionCover>
         <GapContainer>
            {params.player.user.publicName}
            {JSON.stringify(params.player)}
         </GapContainer>
      </SectionCover>
   );
}
