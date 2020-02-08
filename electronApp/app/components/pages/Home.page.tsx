import {Grid} from "@material-ui/core";
import {OptionsObject, SnackbarMessage, withSnackbar} from "notistack";
import React from "react";
import {useSelector} from "react-redux";
import {rootReducerTypes} from "../../store/reducers";
import AccountProfileSection from "../content/accountProfileSection/AccountProfileSection";
import ElementTransition from "../content/elementTransition/ElementTransition";
import FriendsPopover from "../content/friendsPopover/FriendsPopover";
import GapContainer from "../content/gapContainer/GapConteiner";
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
         <Grid container>
            <Grid item style={{width: "600px"}}>
               <GapContainer padding={"40px"} gap={"20px"} style={{gridTemplateRows: "auto 1fr auto"}}>
                  <AccountProfileSection account={account} enqueueSnackbar={props.enqueueSnackbar}/>
                  {account.friends.length > 0 ?
                     <SectionCover title={<FriendsPopover/>}>
                        <GapContainer>
                           <Grid container spacing={1}>
                              {account.friends.map((f: any) =>
                                 <Grid item key={Math.random()}>
                                    <ElementTransition delay={f.num * 50}>
                                       <UserAccountAvatar
                                          friend
                                          avatarUrlHash={f.avatarUrlHash}
                                          publicName={f.publicName}
                                       />
                                    </ElementTransition>
                                 </Grid>
                              )}
                           </Grid>
                        </GapContainer>
                     </SectionCover> : ""
                  }
               </GapContainer>
            </Grid>
            <Grid xs item>

            </Grid>
         </Grid>
      </ElementTransition>
   );
}

export default withSnackbar(HomePage);
