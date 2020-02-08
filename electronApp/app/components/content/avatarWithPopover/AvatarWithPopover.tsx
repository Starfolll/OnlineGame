import {Avatar, Box, makeStyles, Popover} from "@material-ui/core";
import React from "react";


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
         <Box
            onClick={handleClick}
            style={{
               padding: "3px",
               background: "rgba(0,0,0,0.3)",
               transition: "border-radius 0.3s ease 0s",
               borderRadius: isAvatarRounded ? "4px" : "50%"
            }}
         >
            <Avatar
               src={avatarSrc}
               style={{transition: "border-radius 0.3s", width: "55px", height: "55px"}}
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
               horizontal: 'center',
            }}
            transformOrigin={{
               vertical: 'top',
               horizontal: 'center',
            }}
         >
            <Box onMouseLeave={handleClose}>
               {props.children}
            </Box>
         </Popover>
      </Box>
   );
}
