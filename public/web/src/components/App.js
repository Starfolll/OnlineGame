import React, {Component} from "react";
import NavBar from "./navBar/NavBar";
import {ThemeProvider} from '@material-ui/core/styles';
import Theme from "./theme/Theme";
import "./theme/Body.css"

class App extends Component {
   render() {
      return (
         <ThemeProvider theme={Theme}>
            <NavBar/>
         </ThemeProvider>
      );
   }
}

export default App;