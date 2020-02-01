import React from "react";
import {OptionsObject, SnackbarMessage, withSnackbar} from "notistack";
import ContentAndActionsContainer from "../../../content/contentAndActionsContainer/ContentAndActionsContainer";
import {Box, Button, LinearProgress, TextField, Typography} from "@material-ui/core";
import GapContainer from "../../../content/gapContainer/GapConteiner";
import SectionTitle from "../../../content/sectionTitle/SectionTitle";
import SectionCover from "../../../content/sectionCover/SectionCover";
import ArrowedPopover from "../../../content/arrowedPopover/ArrowedPopover";
import Joi from "@hapi/joi";


const validationSchema = Joi.object().keys({
   email: Joi.string().min(6).max(255).email({tlds: {allow: false}}).required(),
});

function ChangePasswordPageSendRequest(props: {
   enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => OptionsObject['key'] | null,
}) {
   const [email, setEmail] = React.useState("");
   const [emailError, setEmailError] = React.useState("");

   const [isLoading, setIsLoading] = React.useState(false);

   const submit = async () => {
      if (isLoading) return;
      if (!!emailError) setEmailError("");

      const validation = validationSchema.validate({email});

      if (!!validation.error) {
         validation.error.details.forEach(detail => {
            if (detail.context!.label === "email")
               setEmailError(detail.message.replace(`"email"`, "Email"));
         });
         return;
      }

      setIsLoading(true);
      fetch(`http://localhost:8000/api/users/actions/changePasswordRequest`, {
         method: "POST",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify({email: email})
      })
         .then(res => res.json())
         .then((data: { sent: boolean, email: string }) => {
            setIsLoading(false);
            if (data.sent) {
               props.enqueueSnackbar(`Sent email to change password to ${data.email}`, {variant: "success"});
            } else throw new Error();
         })
         .catch(err => {
            console.log(err);
            setIsLoading(false);
            props.enqueueSnackbar("Something went wrong...", {variant: "error"});
         });
   };

   return (
      <ContentAndActionsContainer content={
         <Box style={{width: "450px"}}>
            <GapContainer padding={"40px"} gap={"30px"}>
               <SectionTitle>
                  CHANGE PASSWORD
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
   );
}

export default withSnackbar(ChangePasswordPageSendRequest);