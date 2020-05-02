import React from "react";
import ElementTransition from "../../../content/elementTransition/ElementTransition";
import {useRouteMatch} from "react-router-dom";
import ContentAndActionsContainer from "../../../content/contentAndActionsContainer/ContentAndActionsContainer";
import {Box, Button, LinearProgress, TextField, Typography} from "@material-ui/core";
import GapContainer from "../../../content/gapContainer/GapConteiner";
import SectionTitle from "../../../content/sectionTitle/SectionTitle";
import SectionCover from "../../../content/sectionCover/SectionCover";
import ArrowedPopover from "../../../content/arrowedPopover/ArrowedPopover";
import Joi from "@hapi/joi";
import {OptionsObject, SnackbarMessage, withSnackbar} from "notistack";


const validationSchema = Joi.object().keys({
   password: Joi.string().min(8).max(255).required()
});

function ChangePasswordPageChangePassword(props: {
   enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => OptionsObject['key'] | null,
}) {
   let {url} = useRouteMatch();

   const urlParams = url.split("/");
   const hash = urlParams[urlParams.length - 1];

   const [isLoading, setIsLoading] = React.useState(false);

   const [password, setPassword] = React.useState("");
   const [passwordError, setPasswordError] = React.useState("");

   const [confirmPassword, setConfirmPassword] = React.useState("");
   const [confirmPasswordError, setConfirmPasswordError] = React.useState("");

   const submit = async () => {
      if (isLoading) return;
      if (!!passwordError) setPasswordError("");
      if (!!confirmPasswordError) setConfirmPasswordError("");

      const validation = validationSchema.validate({password});

      if (!!validation.error) {
         validation.error.details.forEach(detail => {
            if (detail.context!.label === "password")
               setPasswordError(detail.message.replace(`"password"`, "Password"));
         });
         return;
      }

      if (password !== confirmPassword) {
         return setConfirmPasswordError("Passwords do not match");
      }

      setIsLoading(true);
      await fetch(`http://localhost:8000/api/users/actions/changePassword`, {
         method: "POST",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify({password, hash})
      })
         .then(res => res.json())
         .then((data: { changed: boolean }) => {
            setIsLoading(false);
            if (data.changed) props.enqueueSnackbar("Password changed", {variant: "success"});
            else throw new Error();
         })
         .catch(err => {
            console.log(err);
            setIsLoading(false);
            props.enqueueSnackbar("Something went wrong...", {variant: "error"});
         });
   };

   return (
      <ElementTransition>
         <ContentAndActionsContainer content={
            <Box style={{width: "450px"}}>
               <GapContainer padding={"40px"} gap={"30px"}>
                  <SectionTitle>
                     CHANGE PASSWORD
                  </SectionTitle>
                  <SectionCover>
                     <GapContainer padding={"20px"} gap={"15px"}>
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
         }/>
      </ElementTransition>
   );
}

export default withSnackbar(ChangePasswordPageChangePassword);