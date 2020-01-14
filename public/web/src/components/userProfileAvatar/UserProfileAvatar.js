import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import Avatar from "../Avatar/Avatar";


const useStyles = makeStyles(theme => ({
   container: {
      borderRadius: "50%",
      border: "2px solid gray",
      width: "50px",
      height: "50px",
      background: "gray"
   },
   name: {
      fontSize: 16,
      color: "yellowgreen",
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      textShadow: "0 0 5px yellowgreen"
   }
}));

export default function UserProfileAvatar(props) {
   const classes = useStyles();

   const userPublicName = props.name;
   const userAvatar = `http://localhost:8000/api/users/avatars/server.png`;

   return (
      <Avatar src={userAvatar}/>
   )
}