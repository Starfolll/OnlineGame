import React from "react";
import ElementTransition from "../content/elementTransition/ElementTransition";
import ContentAndActionsContainer from "../content/contentAndActionsContainer/ContentAndActionsContainer";
import GapContainer from "../content/gapContainer/GapConteiner";
import {Button, LinearProgress, Typography} from "@material-ui/core";
import SectionCover from "../content/sectionCover/SectionCover";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {accountActionSingOutAccount} from "../../store/actions/account.actions";
import {OptionsObject, SnackbarMessage, withSnackbar} from "notistack";
// @ts-ignore
import {rootReducerTypes} from "../../store/reducers";
import AccountProfileSection from "../content/accountProfileSection/AccountProfileSection";
import {userAccountData} from "../../store/actions/account.actions.types";


function AccountPage(props: {
   enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => OptionsObject['key'] | null,
}) {
   const history = useHistory();
   const dispatch = useDispatch();

   const account: userAccountData = useSelector((state: rootReducerTypes) => state.account);


   const [isLoadingChangePasswordButton, setIsLoadingChangePasswordButton] = React.useState(false);


   const sighOut = (): void => {
      dispatch(accountActionSingOutAccount());
      history.push("/");
   };

   const changePassword = (): void => {
      if (isLoadingChangePasswordButton) return;

      setIsLoadingChangePasswordButton(true);
      fetch(`http://localhost:8000/api/users/actions/changePasswordRequest`,{
         method: "POST",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify({email: account.email})
      })
         .then(res => res.json())
         .then((data: { sent: boolean, email?: string }) => {
            setIsLoadingChangePasswordButton(false);
            console.log(data);
            if (data.sent && !!data.email)
               props.enqueueSnackbar(`Sent email to change password to ${account.email}`, {variant: "success"});
            else throw new Error();
         })
         .catch(err => {
            console.log(err);
            setIsLoadingChangePasswordButton(false);
            props.enqueueSnackbar("Something went wrong...", {variant: "error"});
         });
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
                        <Button
                           onClick={changePassword}
                           disabled={isLoadingChangePasswordButton}
                           size={"small"}
                           fullWidth
                        >
                           <Typography color={"error"} variant={"subtitle2"}>
                              CHANGE PASSWORD
                           </Typography>
                        </Button>
                        <Button onClick={sighOut} size={"small"} fullWidth>
                           <Typography color={"error"} variant={"subtitle2"}>
                              SIGN OUT
                           </Typography>
                        </Button>
                        <LinearProgress style={{display: }}/>
                     </GapContainer>
                  </SectionCover>
               </GapContainer>
            }
         />
      </ElementTransition>
   );
}

export default withSnackbar(AccountPage);