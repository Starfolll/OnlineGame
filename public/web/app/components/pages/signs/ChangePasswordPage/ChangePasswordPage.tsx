import React from "react";
import ElementTransition from "../../../content/elementTransition/ElementTransition";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import ChangePasswordPageSendRequest from "./ChangePasswordPage.sendRequest";
import ChangePasswordPageChangePassword from "./ChangePasswordPage.changePassword";


export default function ChangePasswordPage() {
   let {path} = useRouteMatch();

   return (
      <ElementTransition>
         <Switch>
            <Route exact path={path}>
               <ChangePasswordPageSendRequest/>
            </Route>
            <Route path={`${path}/:hash`}>
               <ChangePasswordPageChangePassword/>
            </Route>
         </Switch>
      </ElementTransition>
   );
}