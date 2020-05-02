import {Badge, Button, Divider, Typography} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {urlsPath} from "../../../env/env";
import {accountActionRemoveFriendRoomInvite} from "../../../store/actions/account/account.actions";
import {userPublicData} from "../../../store/actions/account/account.actions.types";
import {rootReducerTypes} from "../../../store/reducers";
import AvatarWithPopover from "../avatarWithPopover/AvatarWithPopover";
import GapContainer from "../gapContainer/GapConteiner";


export default function UserAccountAvatar(props: {
   avatarUrlHash: string | undefined,
   publicName: string,
   friend?: boolean,
   online?: boolean,
   me?: boolean,
   id?: string,
   roomInviteId?: string
}) {
   const dispatch = useDispatch();
   const lobby = useSelector((state: rootReducerTypes) => state.globalLobby);
   const roomData = useSelector((state: rootReducerTypes) => state.room);
   const avatarUrl = !props.avatarUrlHash ? urlsPath.getDefaultAvatar() : urlsPath.getUserAvatar(props.avatarUrlHash);
   const friend = props.friend ?? false;
   const userPopover = props.me ?? false;

   const sendRoomInvite = () => {
      if (!!lobby) lobby.lobbyActions.inviteFriendToRoom(props.id, roomData.roomData.id);
   };

   const joinRoom = () => {
      if (!!lobby) {
         if (props.id) dispatch(accountActionRemoveFriendRoomInvite(props.id));
         lobby.lobbyActions.connectToPrivateRoom(props.roomInviteId);
      }
   };

   return (
      <Badge color={"primary"} variant={"dot"} invisible={!props.online} overlap={"circle"}>
         <Badge
            color={"secondary"}
            variant={"dot"}
            invisible={!props.roomInviteId}
            overlap={"circle"}
            anchorOrigin={{
               vertical: "bottom",
               horizontal: "left",
            }}
         >
            <AvatarWithPopover usePopover={!userPopover} avatarSrc={avatarUrl}>
               {friend ?
                  <GapContainer style={{width: "300px"}} padding={"5px"} gap={"5px"}>
                     <Typography variant={"body1"} align={"center"} color={"secondary"}>
                        {props.publicName}
                     </Typography>
                     <Divider/>
                     {!!roomData && !roomData.roomData.isPublic && props.online &&
                     !!props.id && !roomData.usersInRoom.some((u: userPublicData) => u.id === props.id) ?
                        <Button
                           onClick={sendRoomInvite}
                           size={"small"}
                           style={{justifyContent: "normal"}}
                           startIcon={<AddIcon/>}
                        >
                           Add to room
                        </Button> : ""
                     }
                     {props.online && !!props.roomInviteId ?
                        <Button
                           onClick={joinRoom}
                           size={"small"}
                           style={{justifyContent: "normal"}}
                           startIcon={<AddIcon/>}
                        >
                           Join room
                        </Button> : ""
                     }
                  </GapContainer>
                  :
                  <GapContainer style={{width: "200px"}} padding={"5px"} gap={"5px"}>
                     nf
                  </GapContainer>
               }
            </AvatarWithPopover>
         </Badge>
      </Badge>
   );
}
