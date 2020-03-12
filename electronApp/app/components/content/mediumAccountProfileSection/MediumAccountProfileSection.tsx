import {Box, Button, ButtonGroup, Fab, Grid, Typography} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import CloseIcon from '@material-ui/icons/Close';
import React from "react";
import Ink from "react-ink";
import {useDispatch, useSelector} from "react-redux";
import {
   accountActionAcceptUserFriendInvite,
   accountActionDeleteUserFromFriends,
   accountActionRejectUserFriendInvite
} from "../../../store/actions/account/account.actions";
import {userPublicData} from "../../../store/actions/account/account.actions.types";
import {rootReducerTypes} from "../../../store/reducers";
import GapContainer from "../gapContainer/GapConteiner";
import UserAccountAvatar from "../userAccountAvatar/UserAccountAvatar";


const useStyles = makeStyles(theme => ({
   container: {
      background: "transparent",
      transition: "background 0.3s",
      borderRadius: "5px",
      "&:hover": {
         background: "rgba(0,0,0,0.05)"
      },
      position: "relative"
   }
}));

export default function MediumAccountProfileSection(props: {
   avatarUrlHash: string | undefined,
   publicName: string,
   lvl: number,
   friend?: boolean,
   id: string,
   online?: boolean
}) {
   const classes = useStyles();
   const friend = props.friend ?? false;
   const [isLoading, setIsLoading] = React.useState(false);
   const account = useSelector((state: rootReducerTypes) => state.account);
   const dispatch = useDispatch();


   const acceptUserFriendInvite = async () => {
      if (isLoading) return;

      setIsLoading(true);
      await fetch(`http://localhost:8000/api/users/actions/acceptInvite`, {
         method: "POST",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify({
            id: account.id,
            token: account.token,
            friendId: props.id
         })
      })
         .then(res => res.json())
         .then((data: { accepted: boolean }) => {
            setIsLoading(false);
            if (data.accepted) dispatch(accountActionAcceptUserFriendInvite({
               avatarUrlHash: props.avatarUrlHash,
               publicName: props.publicName,
               lvl: props.lvl,
               id: props.id
            } as userPublicData));
         })
         .catch(err => {
            console.error(err);
            setIsLoading(false);
         });
   };

   const rejectUserFriendInvite = async () => {
      if (isLoading) return;

      setIsLoading(true);
      await fetch(`http://localhost:8000/api/users/actions/rejectInvite`, {
         method: "POST",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify({
            id: account.id,
            token: account.token,
            inviteUserId: props.id
         })
      })
         .then(res => res.json())
         .then((data: { rejected: boolean }) => {
            if (data.rejected) return;
            dispatch(accountActionRejectUserFriendInvite({
               avatarUrlHash: props.avatarUrlHash,
               publicName: props.publicName,
               lvl: props.lvl,
               id: props.id
            } as userPublicData));
         })
         .catch(err => console.error(err));

      setIsLoading(false);
   };

   const removeUserFromFriends = async () => {
      if (isLoading) return;

      setIsLoading(true);
      await fetch(`http://localhost:8000/api/users/actions/deleteFriend`, {
         method: "POST",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify({
            id: account.id,
            token: account.token,
            friendId: props.id
         })
      })
         .then(res => res.json())
         .then((data: { rejected: boolean }) => {
            if (data.rejected) return;
            dispatch(accountActionDeleteUserFromFriends(props.id));
         })
         .catch(err => console.error(err));

      setIsLoading(false);
   };

   return (
      <Box className={classes.container}>
         <Ink/>
         <GapContainer padding={"5px"}>
            <Grid container>
               <Grid item>
                  <UserAccountAvatar online={props.online} friend={friend} id={props.id} avatarUrlHash={props.avatarUrlHash} publicName={props.publicName}/>
               </Grid>
               <Grid item xs>
                  <GapContainer style={{marginLeft: "10px"}}>
                     <Box style={{display: "flex", justifyContent: "space-between"}}>
                        <Typography color={"secondary"} variant={"subtitle1"}>
                           {props.publicName}
                        </Typography>

                        {!friend ?
                           <ButtonGroup variant={"text"} size={"medium"}>
                              <Button onClick={acceptUserFriendInvite} disabled={isLoading}>
                                 <CheckIcon style={{color: "yellowGreen"}}/>
                              </Button>
                              <Button onClick={rejectUserFriendInvite} disabled={isLoading}>
                                 <ClearIcon color={"error"}/>
                              </Button>
                           </ButtonGroup>
                           :
                           <GapContainer padding={"0"} style={{gridTemplateColumns: "auto auto"}}>
                              <Typography style={{color: "black", display: "flex"}} variant={"body1"}>
                                 lvl : {props.lvl}
                              </Typography>
                              <Fab onClick={removeUserFromFriends} style={{
                                 background: "black",
                                 width: "35px",
                                 height: "35px"
                              }} size={"small"}>
                                 <CloseIcon fontSize={"small"} color={"error"}/>
                              </Fab>
                           </GapContainer>
                        }
                     </Box>
                  </GapContainer>
               </Grid>
            </Grid>
         </GapContainer>
      </Box>
   );
}
