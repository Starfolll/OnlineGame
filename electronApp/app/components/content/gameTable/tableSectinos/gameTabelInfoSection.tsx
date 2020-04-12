import React from "react";
import {useSelector} from "react-redux";
import {rootReducerTypes} from "../../../../store/reducers";
import GapContainer from "../../gapContainer/GapConteiner";
import SectionCover from "../../sectionCover/SectionCover";


export default function GameTableStatsSection() {
   const tableInfo = useSelector((state: rootReducerTypes) => state.gameTable.tableInfo);

   return (
      <SectionCover>
         <GapContainer/>
      </SectionCover>
   );
}
