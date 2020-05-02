import React from "react";
import ElementTransition from "../content/elementTransition/ElementTransition";
import ContentAndActionsContainer from "../content/contentAndActionsContainer/ContentAndActionsContainer";
import GapContainer from "../content/gapContainer/GapConteiner";
import {Box, Button, Typography} from "@material-ui/core";
import SectionCover from "../content/sectionCover/SectionCover";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {accountActionSingOutAccount} from "../../store/actions/account.actions";
import {OptionsObject, SnackbarMessage, withSnackbar} from "notistack";
// @ts-ignore
import {rootReducerTypes} from "../../store/reducers";
import AccountProfileSection from "../content/accountProfileSection/AccountProfileSection";
import {userAccountData} from "../../store/actions/account.actions.types";
import SectionTitle from "../content/sectionTitle/SectionTitle";
import MediumAccountProfileSection from "../content/mediumAccountProfileSection/MediumAccountProfileSection";
import RedirectLink from "../content/redirectLink/RedirectLink";


function AccountPage(props: {
   enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => OptionsObject['key'] | null,
}) {
   const history = useHistory();
   const dispatch = useDispatch();

   const account: userAccountData = useSelector((state: rootReducerTypes) => state.account);

   const sighOut = (): void => {
      dispatch(accountActionSingOutAccount());
      history.push("/");
   };

   return (
      <ElementTransition>
         <ContentAndActionsContainer
            content={
               <Box style={{width: "100%", maxWidth: "600px"}}>
                  <GapContainer padding={"40px"} gap={"30px"}>
                     <SectionTitle>
                        ACCOUNT
                     </SectionTitle>

                     <AccountProfileSection
                        account={account}
                        enqueueSnackbar={props.enqueueSnackbar}
                     />

                     {account.friends.length > 0 ?
                        <SectionTitle>
                           FRIENDS
                        </SectionTitle> : ""
                     }

                     {account.friends.length > 0 ? (account.friends.map(f =>
                        <MediumAccountProfileSection
                           avatarUrlHash={f.avatarUrlHash}
                           lvl={f.lvl}
                           publicName={f.publicName}
                        />)) : ""
                     }
                  </GapContainer>
               </Box>
            }
            actions={
               <GapContainer style={{width: "240px"}} padding={"40px"} gap={"30px"}>
                  <SectionCover>
                     <GapContainer padding={"5px"} gap={"5px"}>
                        <RedirectLink title={"CHANGE PASSWORD"} link={"/changePassword"}/>
                        <Button onClick={sighOut} size={"small"} fullWidth>
                           <Typography color={"error"} variant={"subtitle2"}>
                              SIGN OUT
                           </Typography>
                        </Button>
                     </GapContainer>
                  </SectionCover>
               </GapContainer>
            }
         />
      </ElementTransition>
   );
}

export default withSnackbar(AccountPage);