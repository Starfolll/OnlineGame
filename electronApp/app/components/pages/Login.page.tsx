import Joi from "@hapi/joi";
import {Box, Button, LinearProgress, TextField, Typography} from "@material-ui/core";
import {OptionsObject, SnackbarMessage, withSnackbar} from "notistack";
import React from "react";
import {useDispatch} from "react-redux";
import rendererWindowApi from "../../../scripts/rendererIPC.types";
import {urlsPath} from "../../env/env";
import LobbyConnection from "../../scripts/lobbyWs/lobbyConnection";
import {accountActionDeclareAccount} from "../../store/actions/account/account.actions";
import {userAccountData} from "../../store/actions/account/account.actions.types";
import ArrowedPopover from "../content/arrowedPopover/ArrowedPopover";
import ContentAndActionsContainer from "../content/contentAndActionsContainer/ContentAndActionsContainer";
import ElementTransition from "../content/elementTransition/ElementTransition";
import GapContainer from "../content/gapContainer/GapConteiner";
import SectionCover from "../content/sectionCover/SectionCover";


const validationSchema = Joi.object().keys({
   email: Joi.string().min(6).max(255).email({tlds: {allow: false}}).required(),
   password: Joi.string().min(8).max(255).required()
});

function LoginPage(props: {
   enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => OptionsObject['key'] | null,
}) {
   const dispatch = useDispatch();

   const [isLoading, setIsLoading] = React.useState(false);

   const [email, setEmail] = React.useState("email1@email.com");
   const [password, setPassword] = React.useState("1234567890");

   const [emailError, setEmailError] = React.useState("");
   const [passwordError, setPasswordError] = React.useState("");

   const submit = async () => {
      if (isLoading) return;
      if (!!emailError) setEmailError("");
      if (!!passwordError) setPasswordError("");

      const validation = validationSchema.validate({email, password});

      if (!!validation.error) {
         console.log(validation);
         validation.error.details.forEach(detail => {
            switch (detail.context!.label) {
               case "email":
                  setEmailError(detail.message.replace(`"email"`, "Email"));
                  break;
               case "password":
                  setPasswordError(detail.message.replace(`"password"`, "Password"));
                  break;
            }
         });
         return;
      }

      setIsLoading(true);
      await fetch(`http://localhost:8000/api/users/actions/login`, {
         method: "POST",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify({email, password})
      })
         .then(res => res.json())
         .then((data: {
            verified: boolean,
            info?: string,
            error?: any,
            userData?: userAccountData
         }) => {
            setIsLoading(false);
            if (!data.verified && typeof data.error === "string") {
               props.enqueueSnackbar(data.error, {variant: "error"});
            }
            if (data.verified && !!data.userData) {
               dispatch(accountActionDeclareAccount({...data.userData, verified: true}));
               new LobbyConnection({
                  account: data.userData,
                  wsUrl: `ws://localhost:8081`,
                  dispatch
               });
               rendererWindowApi.setFullscreen(true);
            }
         })
         .catch(err => {
            console.log(err);
            setIsLoading(false);
            props.enqueueSnackbar("Something went wrong...", {variant: "error"});
         });
   };

   return (
      <ElementTransition>
         <ContentAndActionsContainer
            content={
               <Box style={{width: "450px"}}>
                  <GapContainer padding={"40px"} gap={"30px"}>
                     <SectionCover title={"LOGIN"}>
                        <GapContainer padding={"20px"} gap={"15px"}>
                           <ArrowedPopover title={emailError}>
                              <TextField
                                 value={email} onChange={event => setEmail(event.target.value)}
                                 error={!!emailError}
                                 required type={"email"} fullWidth label={"Email"}
                              />
                           </ArrowedPopover>
                           <ArrowedPopover title={passwordError}>
                              <TextField
                                 value={password} onChange={event => setPassword(event.target.value)}
                                 error={!!passwordError}
                                 required type={"password"} fullWidth label={"Password"}
                              />
                           </ArrowedPopover>
                        </GapContainer>
                     </SectionCover>
                     <SectionCover>
                        <GapContainer padding={"5px"} gap={"5px"}>
                           <Button disabled={isLoading} onClick={submit} fullWidth>
                              <Typography variant={"subtitle2"} color={"primary"}>
                                 SUBMIT
                              </Typography>
                           </Button>
                           <Box style={{display: isLoading ? "block" : "none"}}>
                              <LinearProgress/>
                           </Box>
                        </GapContainer>
                     </SectionCover>
                     <SectionCover>
                        <GapContainer padding={"5px"} gap={"5px"}>
                           <Button
                              fullWidth
                              onClick={() => rendererWindowApi.openBrowserPage(urlsPath.signUpPage())}
                           >
                              SIGN UP
                           </Button>
                           <Button
                              fullWidth
                              onClick={() => rendererWindowApi.openBrowserPage(urlsPath.changePassword())}
                           >
                              CHANGE PASSWORD
                           </Button>
                        </GapContainer>
                     </SectionCover>
                  </GapContainer>
               </Box>
            }
         />
      </ElementTransition>
   );
}

export default withSnackbar(LoginPage);
