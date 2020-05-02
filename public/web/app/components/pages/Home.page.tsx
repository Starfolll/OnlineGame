import React from "react";
import SectionCover from "../content/sectionCover/SectionCover";
import GapContainer from "../content/gapContainer/GapConteiner";
import ElementTransition from "../content/elementTransition/ElementTransition";


export default function HomePage() {
   return (
      <ElementTransition>
         <GapContainer>
            <SectionCover>
               <GapContainer>
                  Home page
               </GapContainer>
            </SectionCover>
         </GapContainer>
      </ElementTransition>
   );
};