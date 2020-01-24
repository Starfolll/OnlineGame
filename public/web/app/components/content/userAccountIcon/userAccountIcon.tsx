import React from "react";
import AvatarWithPopover from "../avatarWithPopover/AvatartWithPopover";
import GapContainer from "../gapContainer/GapConteiner";
import RedirectLink from "../redirectLink/RedirectLink";


export default function UserAccountIcon(props: {
   userName: string;
}) {
   return (
      <AvatarWithPopover avatarSrc={`http://localhost:8000/api/users/avatars/server.png`}>
         <GapContainer style={{width: "210px"}} gap={"5px"} padding={"5px"}>
            <RedirectLink title={"ACCOUNT"} link={"/account"}/>
         </GapContainer>
      </AvatarWithPopover>
   );
}