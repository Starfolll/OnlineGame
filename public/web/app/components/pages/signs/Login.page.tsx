import React from "react";
import SectionCover from "../../content/sectionCover/SectionCover";
import GapContainer from "../../content/gapContainer/GapConteiner";
import ElementTransition from "../../content/elementTransition/ElementTransition";
import Joi from "@hapi/joi";
import {Box, Button, LinearProgress, TextField, Typography} from "@material-ui/core";
import ArrowedPopover from "../../content/arrowedPopover/ArrowedPopover";
import {OptionsObject, SnackbarMessage, withSnackbar} from "notistack";
import {useDispatch} from "react-redux";
import {accountActionDeclareAccount} from "../../../store/actions/account.actions";
import {userAccountData} from "../../../store/actions/account.actions.types";
import {useHistory} from "react-router-dom";
import ContentAndActionsContainer from "../../content/contentAndActionsContainer/ContentAndActionsContainer";
import RedirectLink from "../../content/redirectLink/RedirectLink";
import SectionTitle from "../../content/sectionTitle/SectionTitle";


const validationSchema = Joi.object().keys({
   email: Joi.string().min(6).max(255).email({tlds: {allow: false}}).required(),
   password: Joi.string().min(8).max(255).required()
});

function LoginPage(props: {
   enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => OptionsObject['key'] | null,
}) {
   const dispatch = useDispatch();
   const history = useHistory();

   const [isLoading, setIsLoading] = React.useState(false);

   const [email, setEmail] = React.useState("");
   const [password, setPassword] = React.useState("");

   const [emailError, setEmailError] = React.useState("");
   const [passwordError, setPasswordError] = React.useState("");

   const submit = async () => {
      if (isLoading) return;
      if (!!emailError) setEmailError("");
      if (!!passwordError) setPasswordError("");

      const validation = validationSchema.validate({
         email, password
      });

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
            if (!data.verified && typeof data.error === "string") props.enqueueSnackbar(data.error, {variant: "error"});
            if (data.verified && !!data.userData) {
               props.enqueueSnackbar(`Welcome ${data.userData.publicName}`, {variant: "success"});
               dispatch(accountActionDeclareAccount({...data.userData, verified: true}));
               history.push("/account");
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
                     <SectionTitle>
                        LOGIN
                     </SectionTitle>
                     <SectionCover>
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
                        <GapContainer padding={"5px"}>
                           <Button disabled={isLoading} onClick={submit} size={"small"} fullWidth>
                              <Typography variant={"subtitle2"}>
                                 SUBMIT
                              </Typography>
                           </Button>
                           <Box style={{display: isLoading ? "block" : "none"}}>
                              <LinearProgress/>
                           </Box>
                        </GapContainer>
                     </SectionCover>
                  </GapContainer>
               </Box>
            }
            actions={
               <GapContainer style={{width: "240px"}} padding={"40px"} gap={"30px"}>
                  <SectionCover>
                     <GapContainer padding={"5px"} gap={"5px"}>
                        <RedirectLink title={"SIGN UP"} link={"/signUp"}/>
                        <RedirectLink title={"FORGOT PASSWORD"} link={"/changePassword"}/>
                     </GapContainer>
                  </SectionCover>
               </GapContainer>
            }
         />
      </ElementTransition>
   );
}

export default withSnackbar(LoginPage);