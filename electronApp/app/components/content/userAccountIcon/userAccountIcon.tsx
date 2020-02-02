import React from "react";
import AvatarWithPopover from "../avatarWithPopover/AvatartWithPopover";
import GapContainer from "../gapContainer/GapConteiner";
import RedirectLink from "../redirectLink/RedirectLink";


export default function UserAccountIcon(props: {
   userName: string;
   avatarUrlHash: string | undefined;
}) {
   return (
      <AvatarWithPopover avatarSrc={
         !props.avatarUrlHash ? `http://localhost:8000/api/users/avatars/server.png` :
            `http://localhost:8000/api/users/avatars/${props.avatarUrlHash}.png`
      }>
         <GapContainer style={{width: "210px"}} gap={"5px"} padding={"5px"}>
            <RedirectLink title={"ACCOUNT"} link={"/account"}/>
         </GapContainer>
      </AvatarWithPopover>
   );
}