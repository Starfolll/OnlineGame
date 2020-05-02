import {Button, Grid, Input} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import React, {useEffect, useRef} from "react";
import {useSelector} from "react-redux";
import {chatMessageInfo} from "../../../store/actions/globalLobby/globalLobby.actions.types";
import {rootReducerTypes} from "../../../store/reducers";
import GapContainer from "../gapContainer/GapConteiner";
import SectionCover from "../sectionCover/SectionCover";
import SectionTitle from "../sectionTitle/SectionTitle";
import ChatMessage from "./ChatMessage";


export default function ChatSection(props: {
   sections?: any
}) {
   const lobbyData = useSelector((state: rootReducerTypes) => state.globalLobby);
   const [message, setMessage] = React.useState("");
   const messagesEndRef: null | any = useRef(null);

   const sendMessage = () => {
      if (!message) return;
      lobbyData.lobbyActions.sendMessage({message: message});
      setMessage("");
   };

   const scrollToBottom = () => {
      if (!!messagesEndRef && !!messagesEndRef.current) messagesEndRef.current.scrollIntoView({behavior: "smooth"});
   };

   useEffect(() => scrollToBottom());

   return (
      <SectionCover style={{maxWidth: "800px", height: "300px", margin: "auto"}}>
         <GapContainer padding={"5px"} gap={"10px"} style={{gridTemplateRows: "auto 1fr", height: "calc(100% - 10px)"}}>
            <SectionTitle>
               CHAT
            </SectionTitle>
            <GapContainer padding={"0"} gap={"5px"} style={{gridTemplateRows: "1fr auto", height: "242px"}}>
               <GapContainer
                  padding={"5px"}
                  gap={"0"}
                  style={{alignContent: "flex-start", overflowY: "auto"}}
               >
                  {!!lobbyData ? lobbyData.lobbyData.chat.map((m: chatMessageInfo) =>
                     <ChatMessage key={Math.random()} message={m}/>
                  ) : ""}
                  <div ref={messagesEndRef}/>
               </GapContainer>
               <GapContainer padding={"5px"} style={{background: "rgba(0,0,0,0.03)", borderRadius: "5px"}}>
                  <Grid container spacing={1}>
                     <Grid xs item>
                        <Input
                           value={message}
                           onChange={e => setMessage(e.target.value)}
                           onKeyDown={e => {
                              if (e.key == "Enter") sendMessage();
                           }}
                           margin={"dense"}
                           color={"secondary"}
                           fullWidth
                        />
                     </Grid>
                     <Grid item>
                        <Button onClick={sendMessage} size={"small"} color={"secondary"}>
                           <SendIcon/>
                        </Button>
                     </Grid>
                  </Grid>
               </GapContainer>
            </GapContainer>
         </GapContainer>
      </SectionCover>
   );
}
