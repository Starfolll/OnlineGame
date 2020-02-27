import {MuiThemeProvider} from "@material-ui/core";
import {amber, blue, red} from "@material-ui/core/colors";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import React from "react";


import "./css/All.css";
import "./css/Body.css";
import "./css/Fonts.css";
import "./css/Html.css";
import "./css/Links.css";
import "./css/Scrollbar.css";


const theme = createMuiTheme({
   palette: {
      primary: {
         main: blue["400"]
      },
      secondary: {
         main: amber["900"]
      },
      error: {
         main: red.A400
      }
   },
   typography: {
      fontFamily: [
         '"Questrial"', '"Helvetica Neue"', 'Arial', 'sans-serif',
         '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"',
      ].join(',')
   }
});

export default function Theme(props: any) {
   return (
      <MuiThemeProvider theme={theme}>
         {props.children}
      </MuiThemeProvider>
   );
}
