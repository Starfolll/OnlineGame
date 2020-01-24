import React from 'react'
import ReactDOM from 'react-dom'
import {compose, createStore} from 'redux';
import {Provider} from 'react-redux';
import {rootReducer} from "./store/reducers";
import App from "./components/App";
import {BrowserRouter as Router} from "react-router-dom"
import Theme from "./components/theme/Theme";
import {SnackbarProvider} from "notistack";


declare global {
   interface Window {
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
   }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers());

ReactDOM.render(
   <Router>
      <Theme>
         <SnackbarProvider maxSnack={4} anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
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