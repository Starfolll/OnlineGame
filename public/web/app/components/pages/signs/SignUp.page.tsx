import React from "react";
import SectionCover from "../../content/sectionCover/SectionCover";
import GapContainer from "../../content/gapContainer/GapConteiner";
import {Box, Button, LinearProgress, TextField, Typography} from "@material-ui/core";
import ArrowedPopover from "../../content/arrowedPopover/ArrowedPopover";
import ElementTransition from "../../content/elementTransition/ElementTransition";
import Joi from "@hapi/joi";
import {OptionsObject, SnackbarMessage, withSnackbar} from "notistack";
import RedirectLink from "../../content/redirectLink/RedirectLink";
import ContentAndActionsContainer from "../../content/contentAndActionsContainer/ContentAndActionsContainer";
import SectionTitle from "../../content/sectionTitle/SectionTitle";


const validationSchema = Joi.object().keys({
   name: Joi.string().min(2).max(255).required().regex(/^[-_.~A-Za-z0-9]+$/),
   publicName: Joi.string().min(2).max(20).required(),
   email: Joi.string().min(6).max(255).email({tlds: {allow: false}}).required(),
   password: Joi.string().min(8).max(255).required()
});

function SignUpPage(props: {
   enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => OptionsObject['key'] | null,
}) {
   const [isLoading, setIsLoading] = React.useState(false);

   const [name, setName] = React.useState("");
   const [publicName, setPublicName] = React.useState("");
   const [email, setEmail] = React.useState("");
   const [password, setPassword] = React.useState("");
   const [confirmPassword, setConfirmPassword] = React.useState("");

   const [nameError, setNameError] = React.useState("");
   const [publicNameError, setPublicNameError] = React.useState("");
   const [emailError, setEmailError] = React.useState("");
   const [passwordError, setPasswordError] = React.useState("");
   const [confirmPasswordError, setConfirmPasswordError] = React.useState("");

   const submit = async (): Promise<void> => {
      if (isLoading) return;
      if (!!nameError) setNameError("");
      if (!!emailError) setEmailError("");
      if (!!publicNameError) setPublicNameError("");
      if (!!passwordError) setPasswordError("");
      if (!!confirmPasswordError) setConfirmPasswordError("");

      const validation = validationSchema.validate({name, publicName, email, password});

      if (!!validation.error) {
         validation.error.details.forEach(detail => {
            switch (detail.context!.label) {
               case "name":
                  setNameError(detail.message.replace(`"name"`, "Name"));
                  break;
               case "email":
                  setEmailError(detail.message.replace(`"email"`, "Email"));
                  break;
               case "publicName":
                  setPublicNameError(detail.message.replace(`"publicName"`, "Public name"));
                  break;
               case "password":
                  setPasswordError(detail.message.replace(`"password"`, "Password"));
                  break;
            }
         });
         return;
      }

      if (password !== confirmPassword) {
         return setConfirmPasswordError("Passwords do not match");
      }

      setIsLoading(true);
      await fetch(`http://localhost:8000/api/users/actions/signUp`, {
         method: "POST",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify({name, publicName, email, password})
      })
         .then(res => res.json())
         .then((data: {
            verified: boolean,
            info?: string,
            error?: { isEmailUsed: boolean, isNameUsed: boolean } | any
         }) => {
            setIsLoading(false);
            if (!data.verified) {
               if (data.error.isEmailUsed) setEmailError("Email is already used");
               if (data.error.isNameUsed) setNameError("Name is already used");
            } else props.enqueueSnackbar(data.info, {variant: "success"});
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
                           <ArrowedPopover title={nameError}>
                              <TextField
                                 value={name} onChange={event => setName(event.target.value)}
                                 error={!!nameError}
                                 required type={"name"} fullWidth label={"Name"}
                              />
                           </ArrowedPopover>
                           <ArrowedPopover title={publicNameError}>
                              <TextField
                                 value={publicName} onChange={event => setPublicName(event.target.value)}
                                 error={!!publicNameError}
                                 required type={"name"} fullWidth label={"Public name"}
                              />
                           </ArrowedPopover>
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
                           <ArrowedPopover title={confirmPasswordError}>
                              <TextField
                                 value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)}
                                 error={!!confirmPasswordError}
                                 required type={"password"} fullWidth label={"Confirm password"}
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
                        <RedirectLink title={"LOGIN"} link={"/login"}/>
                        <RedirectLink title={"FORGOT PASSWORD"} link={"/changePassword"}/>
                     </GapContainer>
                  </SectionCover>
               </GapContainer>
            }
         />
      </ElementTransition>
   );
}

export default withSnackbar(SignUpPage);