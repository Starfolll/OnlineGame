import React from "react";
import {useHistory} from "react-router-dom"
import {Button, Typography} from "@material-ui/core";


export default function RedirectLink(props: {
   style?: React.CSSProperties,
   typographyStyle?: React.CSSProperties,
   title: string,
   link: string
}) {
   const history = useHistory();

   return (
      <Button style={{textTransform: "none", ...props.style}} onClick={() => history.push(props.link)} size={"small"} fullWidth>
         <Typography style={{...props.typographyStyle}} variant={"subtitle2"}>
            {props.title}
         </Typography>
      </Button>
   );
}