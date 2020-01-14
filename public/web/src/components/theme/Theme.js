import React from "react";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {lightBlue, purple} from "@material-ui/core/colors";


const Theme = createMuiTheme({
   palette: {
      primary: purple,
      secondary: lightBlue,
   },
   status: {
      danger: 'orange',
   },
   typography: {
      fontFamily: ["Quicksand", "sans-serif"]
   }
});

export default Theme;