import React from "react";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {MuiThemeProvider} from "@material-ui/core";
import {lightGreen, purple, red} from "@material-ui/core/colors";


import "./css/Body.css";
import "./css/All.css";
import "./css/Links.css";


const theme = createMuiTheme({
   palette: {
      primary: lightGreen,
      secondary: purple,
      error: {
         main: red["400"]
      }
   },
   typography: {
      fontFamily: [
         '"Quicksand"', '"Helvetica Neue"', 'Arial', 'sans-serif',
         '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"',
      ].join(',')
   }
});

export default function Theme(props: any) {
   return (
      <MuiThemeProvider theme={theme}>
         {props.children}
      </MuiThemeProvider>
   )
}