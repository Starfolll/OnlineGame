import React from "react";
import GapContainer from "../gapContainer/GapConteiner";
import RedirectLink from "../redirectLink/RedirectLink";
import AvatarWithPopover from "../avatarWithPopover/AvatartWithPopover";


export default function UserSignIcon(props: any) {
   return (
      <AvatarWithPopover>
         <GapContainer style={{width: "210px"}} gap={"5px"} padding={"5px"}>
            <RedirectLink title={"LOGIN"} link={"/login"}/>
            <RedirectLink title={"SIGN UP"} link={"/signUp"}/>
         </GapContainer>
      </AvatarWithPopover>
   );
}