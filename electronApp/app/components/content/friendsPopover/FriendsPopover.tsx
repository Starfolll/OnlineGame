import {Badge, Box, Button, ButtonGroup, Dialog, Divider} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import {useSelector} from "react-redux";
import {userPublicData} from "../../../store/actions/account.actions.types";
import {rootReducerTypes} from "../../../store/reducers";
import GapContainer from "../gapContainer/GapConteiner";
import MediumAccountProfileSection from "../mediumAccountProfileSection/MediumAccountProfileSection";
import SectionCover from "../sectionCover/SectionCover";


export default function FriendsPopover(props: {}) {
   const account = useSelector((state: rootReducerTypes) => state.account);
   const [open, setOpen] = React.useState(false);

   return (
      <Box>
         <Badge style={{width: "100%"}} badgeContent={account.invites.length} color="primary">
            <Button onClick={() => setOpen(true)} fullWidth size={"small"} color={"primary"}>
               FRIENDS
            </Button>
         </Badge>
         <Dialog fullWidth maxWidth={"md"} onClose={() => setOpen(false)} open={open}>
            <Box style={{height: "600px"}}>
               <GapContainer padding={"5px"} gap={"5px"}>
                  <SectionCover inverted>
                     <GapContainer padding={"5px"} style={{justifyContent: "end"}}>
                        <ButtonGroup variant={"text"} color={"primary"} size={"small"}>
                           <Button>
                              <AddIcon/>
                           </Button>
                        </ButtonGroup>
                     </GapContainer>
                  </SectionCover>
                  {account.invites.length > 0 ? <GapContainer padding={"5px"} gap={"5px"}>
                     {account.invites.map((f: userPublicData) =>
                        <MediumAccountProfileSection
                           key={Math.random()}
                           id={f.id}
                           avatarUrlHash={f.avatarUrlHash}
                           publicName={f.publicName}
                           lvl={f.lvl}
                        />
                     )}
                  </GapContainer> : ""}
                  {account.invites.length > 0 ? <Divider/> : ""}
                  <GapContainer padding={"5px"} gap={"5px"}>
                     {account.friends.map((f: userPublicData) =>
                        <MediumAccountProfileSection
                           friend
                           key={Math.random()}
                           id={f.id}
                           avatarUrlHash={f.avatarUrlHash}
                           publicName={f.publicName}
                           lvl={f.lvl}
                        />
                     )}
                  </GapContainer>
               </GapContainer>
            </Box>
         </Dialog>
      </Box>
   );
}
