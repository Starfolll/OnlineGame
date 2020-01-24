import React from "react";
import {Avatar, Box, makeStyles, Popover} from "@material-ui/core";


const useStyles = makeStyles(theme => ({
   popover: {
      background: "transparent",
      margin: theme.spacing(1),
   }
}));

export default function AvatarWithPopover(props: {
   avatarSrc?: string,
   children?: any
}) {
   const avatarSrc = props.avatarSrc ?? "";

   const classes = useStyles();
   const [anchorEl, setAnchorEl] = React.useState(null);
   const [isAvatarRounded, setIsAvatarRounded] = React.useState(false);
   const open = Boolean(anchorEl);

   const handleClick = (event: any) => {
      setAnchorEl(event.currentTarget);
      setIsAvatarRounded(true);
   };
   const handleClose = () => {
      setAnchorEl(null);
      setIsAvatarRounded(false);
   };

   return (
      <Box>
         <Box onClick={handleClick}>
            <Avatar
               src={avatarSrc}
               style={{transition: "border-radius 0.3s"}}
               variant={isAvatarRounded ? "rounded" : "circle"}
            />
         </Box>

         <Popover
            open={open}
            className={classes.popover}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
               vertical: 'bottom',
               horizontal: 'right',
            }}
            transformOrigin={{
               vertical: 'top',
               horizontal: 'right',
            }}
         >
            <Box onMouseLeave={handleClose}>
               {props.children}
            </Box>
         </Popover>
      </Box>
   );
}