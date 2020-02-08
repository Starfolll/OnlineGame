import {Button} from "@material-ui/core";
import React from "react";
import ElementTransition from "../elementTransition/ElementTransition";
import GapContainer from "../gapContainer/GapConteiner";
import SectionCover from "../sectionCover/SectionCover";


export default function PlayGameButton() {
   return (
      <ElementTransition delay={0.5}>
         <GapContainer
            padding={"40px"}
            gap={"5px"}
            style={{
               width: "350px",
               position: "fixed",
               right: "0",
               bottom: "0"
            }}
         >
            <SectionCover inverted>
               <GapContainer padding={"5px"}>
                  <Button color={"primary"} size={"large"} fullWidth>
                     PLAY
                  </Button>
               </GapContainer>
            </SectionCover>
         </GapContainer>
      </ElementTransition>
   );
}
