import * as React from "react";
import {useSelector} from "react-redux";
import {withRouter} from "react-router-dom";
import {rootReducerTypes} from "../store/reducers";
import AppVersion from "./content/appVerion/AppVerion";
import Frame from "./content/frame/Frame";
import GapContainer from "./content/gapContainer/GapConteiner";
import NavMenu from "./content/navMenu/NavMenu";
import PlayGameButton from "./content/playGameButton/PlayGameButton";
import HomePage from "./pages/Home.page";
import LoginPage from "./pages/Login.page";


function App(props: any) {
   const account = useSelector((state: rootReducerTypes) => state.account);

   return (
      <GapContainer padding={"5px"} gap={"5px"}>
         {!account ? <Frame/> : ""}
         {!account ? <LoginPage/> : <HomePage/>}

         {!!account ? <PlayGameButton/> : ""}
         {!!account ? <NavMenu/> : ""}

         <AppVersion/>
      </GapContainer>
   );
}

export default withRouter(props => <App {...props}/>);
