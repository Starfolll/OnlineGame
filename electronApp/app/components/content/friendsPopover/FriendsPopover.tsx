import {
   Badge,
   Box,
   Button,
   ButtonGroup,
   Dialog,
   Divider,
   LinearProgress,
   makeStyles,
   Popover,
   TextField
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import {useSelector} from "react-redux";
import {userPublicData} from "../../../store/actions/account/account.actions.types";
import {rootReducerTypes} from "../../../store/reducers";
import GapContainer from "../gapContainer/GapConteiner";
import MediumAccountProfileSection from "../mediumAccountProfileSection/MediumAccountProfileSection";
import SectionCover from "../sectionCover/SectionCover";


const useStyles = makeStyles(theme => ({
   popover: {
      background: "transparent",
      margin: theme.spacing(1),
   }
}));

export default function FriendsPopover(props: {}) {
   const classes = useStyles();
   const account = useSelector((state: rootReducerTypes) => state.account);
   const [open, setOpen] = React.useState(false);

   const [anchorElAddFriendPopover, setAnchorElAddFriendPopover] = React.useState<HTMLButtonElement | null>(null);
   const handleClickAddFriendPopover = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorElAddFriendPopover(event.currentTarget);
   const handleCloseAddFriendPopover = () => setAnchorElAddFriendPopover(null);
   const openAddFriendPopover = Boolean(anchorElAddFriendPopover);
   const idAddFriendPopover = openAddFriendPopover ? "simple-popover" : undefined;

   const [addingFriendName, setAddingFriendName] = React.useState("");

   const [isLoading, setIsLoading] = React.useState(false);

   const sendFriendRequest = async () => {
      console.log(addingFriendName);
      if (isLoading) return;
      if (!addingFriendName) return;

      setIsLoading(true);

      await fetch(`http://localhost:8000/api/users/actions/sendFriendInvite`, {
         method: "POST",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify({
            id: account.id,
            token: account.token,
            name: addingFriendName
         })
      })
         .then(res => res.json())
         .then((data: { sent: boolean }) => {
            if (data.sent) {
               setAddingFriendName("");
            } else {
               console.log(data);
            }
         })
         .catch(err => {
            console.log(err);
         });

      setIsLoading(false);
   };

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
                           <Button onClick={e => handleClickAddFriendPopover(e)}>
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
                           friend id={f.id} online={f.isConnected}
                           key={Math.random()}
                           avatarUrlHash={f.avatarUrlHash}
                           publicName={f.publicName}
                           lvl={f.lvl}
                        />
                     )}
                  </GapContainer>
               </GapContainer>
            </Box>
         </Dialog>

         <Popover
            id={idAddFriendPopover}
            open={openAddFriendPopover}
            anchorEl={anchorElAddFriendPopover}
            onClose={handleCloseAddFriendPopover}
            className={classes.popover}
            anchorOrigin={{
               vertical: "bottom",
               horizontal: "right",
            }}
            transformOrigin={{
               vertical: "top",
               horizontal: "right",
            }}
         >
            <GapContainer>
               <GapContainer
                  padding={"0"}
                  style={{
                     width: "350px",
                     gridTemplateColumns: "1fr auto",
                     justifyContent: "center",
                     alignContent: "center"
                  }}
               >
                  <TextField
                     fullWidth
                     disabled={isLoading}
                     label="User name"
                     value={addingFriendName}
                     onChange={e => setAddingFriendName(e.target.value)}
                     color={"primary"}
                  />
                  <Button
                     disabled={isLoading}
                     variant={"text"}
                     color={"primary"}
                     size={"small"}
                     onClick={() => sendFriendRequest()}
                  >
                     <AddIcon/>
                  </Button>
               </GapContainer>

               {isLoading ? <LinearProgress/> : ""}
            </GapContainer>
         </Popover>
      </Box>
   );
}
