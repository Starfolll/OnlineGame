import {Button, Grid} from "@material-ui/core";
import React from "react";
import {useSelector} from "react-redux";
import {userPublicData} from "../../../store/actions/account/account.actions.types";
import {rootReducerTypes} from "../../../store/reducers";
import ElementTransition from "../elementTransition/ElementTransition";
import GapContainer from "../gapContainer/GapConteiner";
import SectionCover from "../sectionCover/SectionCover";
import UserAccountAvatar from "../userAccountAvatar/UserAccountAvatar";


export default function RoomSection() {
   const account = useSelector((state: rootReducerTypes) => state.account);
   const globalLobby = useSelector((state: rootReducerTypes) => state.globalLobby);
   const roomData = useSelector((state: rootReducerTypes) => state.room);

   return (
      <ElementTransition>
         <SectionCover title={!!roomData && !roomData.roomData.isPublic ? "ROOM" : ""} style={{width: "350px"}}>
            {!!roomData ?
               <ElementTransition>
                  <GapContainer padding={"5px"}>
                     <Grid container justify={"space-around"} alignContent={"center"}>
                        {roomData.usersInRoom.map((u: userPublicData) =>
                           <Grid key={Math.random()} item>
                              {account.id === u.id ?
                                 <UserAccountAvatar
                                    me avatarUrlHash={account.avatarUrlHash}
                                    publicName={account.publicName}
                                 />
                                 :
                                 <UserAccountAvatar
                                    avatarUrlHash={u.avatarUrlHash}
                                    publicName={u.publicName}
                                 />
                              }
                           </Grid>
                        )}
                     </Grid>
                  </GapContainer>
               </ElementTransition>
               :
               <GapContainer padding={"5px"}>
                  <Button
                     onClick={() => globalLobby.lobbyActions.createNewPrivateRoom()}
                     color={"secondary"}
                     size={"large"}
                  >
                     CREATE ROOM
                  </Button>
               </GapContainer>
            }
         </SectionCover>
      </ElementTransition>
   );
}
