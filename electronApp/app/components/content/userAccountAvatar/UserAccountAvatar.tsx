import {Button} from "@material-ui/core";
import {green} from "@material-ui/core/colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import React from "react";
import {urlsPath} from "../../../env/env";
import AvatarWithPopover from "../avatarWithPopover/AvatarWithPopover";
import GapContainer from "../gapContainer/GapConteiner";


const useStyles = makeStyles(theme => ({
   redButton: {
      textPrimary: theme.palette.error
   },
   greenButton: {
      textPrimary: green
   }
}));

export default function UserAccountAvatar(props: {
   avatarUrlHash: string | undefined,
   publicName: string,
   friend?: boolean,
}) {
   const avatarUrl = !props.avatarUrlHash ? urlsPath.getDefaultAvatar() : urlsPath.getUserAvatar(props.avatarUrlHash);
   const friend = props.friend ?? false;
   const classes = useStyles();

   return (
      <AvatarWithPopover avatarSrc={avatarUrl}>
         {friend ?
            <div>f</div>
            :
            <GapContainer style={{width: "200px"}} padding={"5px"} gap={"5px"}>
               nf
            </GapContainer>
         }
      </AvatarWithPopover>
   );
}
