import {Grid} from "@material-ui/core";
import {OptionsObject, SnackbarMessage, withSnackbar} from "notistack";
import React from "react";
import {useSelector} from "react-redux";
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

   let friends: any = account.friends;
   for (let i = 0; i < friends.length; i++) {
      friends[i] = {...friends[i], num: i + 1};
   }

   return (
      <ElementTransition>
         <Grid container style={{height: "100%"}}>
            <Grid item style={{width: "600px"}}>
               <GapContainer padding={"40px"} gap={"20px"} style={{gridTemplateRows: "auto 1fr auto"}}>
                  <AccountProfileSection account={account} enqueueSnackbar={props.enqueueSnackbar}/>

                  <SectionCover title={<FriendsPopover/>}>
                     {account.friends.length > 0 ?
                        <GapContainer>
                           <Grid container spacing={1}>
                              {account.friends.map((f: any) =>
                                 <Grid item key={Math.random()}>
                                    <ElementTransition delay={f.num * 50}>
                                       <UserAccountAvatar
                                          friend online={!!f.isConnected}
                                          avatarUrlHash={f.avatarUrlHash}
                                          publicName={f.publicName}
                                       />
                                    </ElementTransition>
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
                  <Grid item style={{width: "100%", marginBottom: "40px"}}>
                     <ChatSection/>
                  </Grid>
               </Grid>
            </Grid>
            <Grid item>
               <Grid
                  container
                  alignItems={"flex-end"}
                  style={{height: "100%"}}
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
