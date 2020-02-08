import {Box, Button, ButtonGroup, Grid, Typography} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import React from "react";
import Ink from "react-ink";
import {useDispatch, useSelector} from "react-redux";
import {
   accountActionAcceptUserFriendInvite,
   accountActionRejectUserFriendInvite
} from "../../../store/actions/account.actions";
import {userPublicData} from "../../../store/actions/account.actions.types";
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
   id: string
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
            setIsLoading(false);
            if (data.rejected) return;
            dispatch(accountActionRejectUserFriendInvite({
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

   return (
      <Box className={classes.container}>
         <Ink/>
         <GapContainer padding={"5px"}>
            <Grid container>
               <Grid item>
                  <UserAccountAvatar friend={friend} avatarUrlHash={props.avatarUrlHash} publicName={props.publicName}/>
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
                           <Typography style={{color: "black", display: "flex"}} variant={"body1"}>
                              lvl : {props.lvl}
                           </Typography>
                        }
                     </Box>
                  </GapContainer>
               </Grid>
            </Grid>
         </GapContainer>
      </Box>
   );
}
