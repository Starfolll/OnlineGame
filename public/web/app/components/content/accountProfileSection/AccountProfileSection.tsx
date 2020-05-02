import React from "react";
import GapContainer from "../gapContainer/GapConteiner";
import SectionCover from "../sectionCover/SectionCover";
import {Avatar, Box, Button, Divider, Grid, Input, LinearProgress, makeStyles, Typography} from "@material-ui/core";
import Donut from "../donut/Donut";
import PublishIcon from "@material-ui/icons/Publish";
import {OptionsObject, SnackbarMessage} from "notistack";
// @ts-ignore
import {FilePicker} from 'react-file-picker'
import {userAccountData} from "../../../store/actions/account.actions.types";
import ArrowedPopover from "../arrowedPopover/ArrowedPopover";
import {useDispatch} from "react-redux";
import {
   accountActionChangeUserAccountAvatarHash,
   accountActionChangeUserPublicName
} from "../../../store/actions/account.actions";
import Joi from "@hapi/joi";
import {urlsPath} from "../../../env/env";


const userChangePublicNameValidationSchema = Joi.object().keys({
   id: Joi.string().required(),
   token: Joi.string().required(),
   publicName: Joi.string().min(2).max(20).required(),
});

const useStyles = makeStyles(theme => ({
   userPublicNameInput: {
      fontSize: theme.typography.h6.fontSize,
      color: theme.palette.secondary.main,
      marginRight: theme.spacing(2)
   },
   avatarUploadContainer: {
      display: "grid",
      gridTemplateAreas: `"I"`,
      "& > *": {
         gridArea: "I"
      }
   },
   avatarUploadItem: {
      display: "grid",
      justifyContent: "center",
      alignContent: "center",
      background: "transparent",
      transition: "background 0.5s",
      borderRadius: "50%",
      zIndex: 1,
      "&:hover": {
         background: "rgba(0,0,0,0.6)",
      },
      "& *": {
         transition: "opacity 0.5s",
         opacity: 0,
      },
      "&:hover *": {
         opacity: 1,
      }
   }
}));

export default function AccountProfileSection(props: {
   account: userAccountData,
   enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => OptionsObject['key'] | null,
}) {
   const classes = useStyles();
   const dispatch = useDispatch();

   const xpInPercent = (props.account.xp * 100) / props.account.xpToNextLvl;

   const [isLoading, setIsLoading] = React.useState(false);
   const avatarUrl = !props.account.avatarUrlHash ?
      urlsPath.getDefaultAvatar() : urlsPath.getUserAvatar(props.account.avatarUrlHash);
   const [userPublicName, setUserPublicName] = React.useState(props.account.publicName);
   const [userPublicNameError, setUserPublicNameError] = React.useState("");

   const onFilePicked = async (file: any) => {
      if (isLoading) return;

      const data = new FormData();
      data.append("avatar", file);
      data.append("id", props.account.id);
      data.append("token", props.account.token);

      await fetch("http://localhost:8000/api/users/actions/uploadAvatar", {
         method: "POST",
         body: data
      })
         .then(res => res.json())
         .then((data: { uploaded: boolean, hash?: string }) => {
            setIsLoading(false);
            if (!data.uploaded || !data.hash) throw new Error();
            else dispatch(accountActionChangeUserAccountAvatarHash(data.hash));
         })
         .catch(err => {
            console.log(err);
            setIsLoading(false);
            props.enqueueSnackbar("Something went wrong...", {variant: "error"});
         });
   };

   const onFilePickError = (message: string) => props.enqueueSnackbar(message, {variant: "error"});


   const changeUserPublicName = () => {
      if (isLoading) return;
      if (userPublicName === props.account.publicName) return;
      if (!!userPublicNameError) setUserPublicNameError("");

      const validation = userChangePublicNameValidationSchema.validate({
         id: props.account.id,
         token: props.account.token,
         publicName: userPublicName
      });

      if (!!validation.error) {
         console.log(validation);
         validation.error.details.forEach(detail => {
            if (detail.context!.label === "publicName")
               setUserPublicNameError(detail.message.replace(`"publicName"`, "Public name"));
         });
         return;
      }

      setIsLoading(true);
      fetch(`http://localhost:8000/api/users/actions/changePublicName`, {
         method: "POST",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify({
            id: props.account.id,
            token: props.account.token,
            publicName: userPublicName
         })
      })
         .then(res => res.json())
         .then((data: { changed: boolean }) => {
            setIsLoading(false);
            if (data.changed) {
               dispatch(accountActionChangeUserPublicName(userPublicName));
            } else {
               console.log(data);
            }
         })
         .catch(err => {
            console.log(err);
            setIsLoading(false);
            props.enqueueSnackbar("Something went wrong...", {variant: "error"});
         });
   };

   return (


      <SectionCover>
         <GapContainer padding={"5px"}>
            <Grid container>
               <Grid item>
                  <GapContainer padding={"10px"}>
                     <Donut radius={"140px"} progress={xpInPercent}>
                        <FilePicker
                           extensions={['jpg', 'jpeg', 'png']}
                           onChange={(file: any) => onFilePicked(file)}
                           onError={(err: any) => onFilePickError(err)}
                        >
                           <Box className={classes.avatarUploadContainer}>
                              <Box className={classes.avatarUploadItem}>
                                 <PublishIcon
                                    style={{marginLeft: "auto", marginRight: "auto"}}
                                    fontSize={"large"} color={"secondary"}
                                 />
                              </Box>
                              <Avatar
                                 src={avatarUrl}
                                 style={{width: "120px", height: "120px"}}
                              />
                           </Box>
                        </FilePicker>
                     </Donut>
                  </GapContainer>
               </Grid>
               <Grid item xs>
                  <GapContainer style={{marginLeft: "10px"}}>
                     <Box>
                        <Box style={{display: "flex", alignItems: "center"}}>
                           <Input
                              disabled={isLoading}
                              error={true}
                              className={classes.userPublicNameInput}
                              value={userPublicName}
                              onChange={event => setUserPublicName(event.target.value)}
                              fullWidth disableUnderline
                           />
                           {props.account.publicName !== userPublicName && !isLoading ?
                              <ArrowedPopover title={userPublicNameError}>
                                 <Button
                                    disabled={isLoading}
                                    onClick={changeUserPublicName}
                                    variant={"outlined"}
                                    size={"small"}
                                 >
                                    <Typography variant={"subtitle2"}>
                                       SAVE
                                    </Typography>
                                 </Button>
                              </ArrowedPopover> : ""}
                        </Box>
                        <Typography style={{color: "black", opacity: 0.5}} variant={"body1"}>
                           {`Aka : ${props.account.name}`}
                        </Typography>
                     </Box>
                     <Divider/>
                     <Box>
                        <Typography style={{color: "black"}} variant={"body1"}>
                           Gold : {props.account.gold}
                        </Typography>
                        <Typography style={{color: "black", display: "flex"}} variant={"body1"}>
                           Lvl : {props.account.lvl}
                        </Typography>
                     </Box>
                     <Divider/>
                  </GapContainer>
               </Grid>
            </Grid>
            <Box style={{display: isLoading ? "block" : "none"}}>
               <LinearProgress/>
            </Box>
         </GapContainer>
      </SectionCover>
   );
}