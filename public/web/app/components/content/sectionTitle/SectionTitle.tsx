import React from "react";
import SectionCover from "../sectionCover/SectionCover";
import GapContainer from "../gapContainer/GapConteiner";
import {Typography} from "@material-ui/core";


export default function SectionTitle(props: any){
   return (
      <SectionCover style={{background: "black", color: "white"}}>
         <GapContainer padding={"5px"}>
            <Typography align={"center"} variant={"subtitle1"}>
               {props.children}
            </Typography>
         </GapContainer>
      </SectionCover>
   );
}