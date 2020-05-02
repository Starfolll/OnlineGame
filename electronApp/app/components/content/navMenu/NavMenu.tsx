import {Box, Fab} from "@material-ui/core";
import ArrowLeft from "@material-ui/icons/ArrowLeft";
import SettingsIcon from '@material-ui/icons/Settings';
import React from "react";
import ElementTransition from "../elementTransition/ElementTransition";
import ExitFab from "../exitFab/ExitFab";
import GapContainer from "../gapContainer/GapConteiner";


export default function NavMenu() {
   const [isExtended, setIsExtended] = React.useState(false);

   return (
      <ElementTransition delay={0.5}>
         <GapContainer
            padding={"40px"}
            gap={"5px"}
            style={{
               width: "50px",
               height: "50px",
               position: "fixed",
               right: "0",
               top: "0"
            }}
         >
            <Box>
               <GapContainer padding={"5px"} gap={"15px"}>
                  <Fab onClick={() => setIsExtended(!isExtended)} size={"medium"} style={{
                     background: "black",
                     transition: "transform 0.3s",
                     transform: isExtended ? "rotate(-90deg)" : "rotate(0deg)"
                  }}>
                     <ArrowLeft fontSize={"large"} color={"primary"}/>
                  </Fab>
                  {isExtended ? <GapContainer padding={"0"} gap={"15px"}>
                     <ElementTransition delay={0}>
                        <Fab style={{background: "white"}} size={"medium"}>
                           <SettingsIcon/>
                        </Fab>
                     </ElementTransition>
                     <ElementTransition delay={50}>
                        <ExitFab/>
                     </ElementTransition>
                  </GapContainer> : ""}
               </GapContainer>
            </Box>
         </GapContainer>
      </ElementTransition>
   );
}
