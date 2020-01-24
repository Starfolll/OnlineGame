import React from "react";
import ElementTransition from "../content/elementTransition/ElementTransition";
import ContentAndActionsContainer from "../content/contentAndActionsContainer/ContentAndActionsContainer";
import GapContainer from "../content/gapContainer/GapConteiner";
import {Button, Typography} from "@material-ui/core";
import SectionCover from "../content/sectionCover/SectionCover";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {accountActionSingOutAccount} from "../../store/actions/account.actions";
import {OptionsObject, SnackbarMessage, withSnackbar} from "notistack";
// @ts-ignore
import {rootReducerTypes} from "../../store/reducers";
import AccountProfileSection from "../content/accountProfileSection/AccountProfileSection";


function AccountPage(props: {
   enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => OptionsObject['key'] | null,
}) {
   const history = useHistory();
   const dispatch = useDispatch();

   const account = useSelector((state: rootReducerTypes) => state.account);

   const sighOut = (): void => {
      dispatch(accountActionSingOutAccount());
      history.push("/");
   };

   return (
      <ElementTransition>
         <ContentAndActionsContainer
            content={
               <AccountProfileSection
                  account={account}
                  enqueueSnackbar={props.enqueueSnackbar}
               />
            }
            actions={
               <GapContainer style={{width: "240px"}} padding={"40px"} gap={"30px"}>
                  <SectionCover>
                     <GapContainer padding={"5px"} gap={"5px"}>
                        <Button size={"small"} fullWidth>
                           <Typography color={"error"} variant={"subtitle2"}>
                              CHANGE PASSWORD
                           </Typography>
                        </Button>
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