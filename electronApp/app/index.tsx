import {SnackbarProvider} from "notistack";
// @ts-ignore
import React from 'react';
// @ts-ignore
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from "react-router-dom";
import {createStore} from 'redux';
import App from "./components/App";
import Theme from "./components/theme/Theme";
import {rootReducer} from "./store/reducers";


const store = createStore(
   rootReducer,
);


ReactDOM.render(
   <Router>
      <Theme>
         <SnackbarProvider maxSnack={4} anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
         }}>
            <Provider store={store}>
               <App/>
            </Provider>
         </SnackbarProvider>
      </Theme>
   </Router>
   ,
   document.getElementById("root")
);
