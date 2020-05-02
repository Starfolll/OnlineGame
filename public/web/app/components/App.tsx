import React from "react";
import NavBar from "./content/navBar/NavBar";
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import LoginPage from "./pages/signs/Login.page";
import SignUpPage from "./pages/signs/SignUp.page";
import UserSignIcon from "./content/userSignIcon/UserSignIcon";
import HomePage from "./pages/Home.page";
import Page404 from "./pages/404.page";
import {useSelector} from "react-redux";
import {rootReducerTypes} from "../store/reducers";
import UserAccountIcon from "./content/userAccountIcon/userAccountIcon";
import AccountPage from "./pages/Account.page";
import GapContainer from "./content/gapContainer/GapConteiner";
import {Box, Typography} from "@material-ui/core";
import ElementTransition from "./content/elementTransition/ElementTransition";
import ChangePasswordPage from "./pages/signs/ChangePasswordPage/ChangePasswordPage";


function App(props: any) {
   const account = useSelector((state: rootReducerTypes) => state.account);
   const {pathname} = props.location;

   return (
      <Box>
         <NavBar
            name={"Prod name"}
            navigationButtons={[
               {title: "HOME", link: "/"},
            ]}
            accountNavigation={
               <ElementTransition>
                  {!account ?
                     (pathname === "/login" || pathname === "/signUp" ? "" : <UserSignIcon/>) :
                     (pathname !== "/account" ?
                        <GapContainer
                           style={{gridTemplateColumns: "auto auto", alignItems: "center"}}
                           padding={"0px"} gap={"10px"}
                        >
                           <Typography variant={"h6"}>{account.publicName}</Typography>
                           <UserAccountIcon userName={account.publicName} avatarUrlHash={account.avatarUrlHash}/>
                        </GapContainer> : "")
                  }
               </ElementTransition>
            }
         />

         <Switch>
            <Route exact path="/">
               <HomePage/>
            </Route>
            <Route path="/login">
               {!account ? <LoginPage/> : <Redirect to={"/"}/>}
            </Route>
            <Route path="/signUp">
               {!account ? <SignUpPage/> : <Redirect to={"/"}/>}
            </Route>
            <Route path="/account">
               {!!account ? <AccountPage/> : <Redirect to={"/"}/>}
            </Route>
            <Route path="/changePassword">
               <ChangePasswordPage/>
            </Route>
            <Route path="*">
               <Page404/>
            </Route>
         </Switch>
      </Box>
   );
}

export default withRouter(props => <App {...props}/>);