import {Grid} from "@material-ui/core";
import {OptionsObject, SnackbarMessage, withSnackbar} from "notistack";
import React from "react";
import {useSelector} from "react-redux";
import {userPublicData} from "../../store/actions/account/account.actions.types";
import {rootReducerTypes} from "../../store/reducers";
import AccountProfileSection from "../content/accountProfileSection/AccountProfileSection";
import ChatSection from "../content/chat/ChatSection";
import ElementTransition from "../content/elementTransition/ElementTransition";
import FriendsPopover from "../content/friendsPopover/FriendsPopover";
import GapContainer from "../content/gapContainer/GapConteiner";
import PlayGameButton from "../content/playGameButton/PlayGameButton";
import RoomSection from "../content/roomSection/RoomSection";
import SectionCover from "../content/sectionCover/SectionCover";
import UserAccountAvatar from "../content/userAccountAvatar/UserAccountAvatar";


function HomePage(props: {
   enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => OptionsObject['key'] | null,
}) {
   const account = useSelector((state: rootReducerTypes) => state.account);

   return (
      <ElementTransition>
         <Grid container style={{height: "calc(100% + 16px)"}} spacing={2}>
            <Grid item style={{width: "600px"}}>
               <GapContainer padding={"5px"} gap={"5px"} style={{gridTemplateRows: "auto 1fr auto"}}>
                  <AccountProfileSection account={account} enqueueSnackbar={props.enqueueSnackbar}/>

                  <SectionCover title={<FriendsPopover/>}>
                     {account.friends.length > 0 ?
                        <GapContainer>
                           <Grid container spacing={1}>
                              {account.friends.map((f: userPublicData) =>
                                 <Grid item key={Math.random()}>
                                    <UserAccountAvatar
                                       friend id={f.id} roomInviteId={f.roomInviteId}
                                       online={f.isConnected}
                                       avatarUrlHash={f.avatarUrlHash}
                                       publicName={f.publicName}
                                    />
                                 </Grid>
                              )}
                           </Grid>
                        </GapContainer> : ""
                     }
                  </SectionCover>
               </GapContainer>
            </Grid>
            <Grid xs item>
               <Grid container alignItems={"flex-end"} style={{height: "100%"}}>
                  <Grid item style={{width: "100%"}}>
                     <ChatSection/>
                  </Grid>
               </Grid>
            </Grid>
            <Grid item>
               <Grid
                  spacing={1}
                  container
                  alignItems={"flex-end"}
                  style={{height: "100%", padding: "5px"}}
                  direction={"column-reverse"}
               >
                  <Grid item>
                     <PlayGameButton/>
                  </Grid>
                  <Grid item>
                     <RoomSection/>
                  </Grid>
               </Grid>
            </Grid>
         </Grid>
      </ElementTransition>
   );
}

export default withSnackbar(HomePage);
