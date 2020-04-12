import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import {cardInfo} from "../../../../../store/actions/table/table.actions.types";
import GapContainer from "../../../gapContainer/GapConteiner";
import SectionCover from "../../../sectionCover/SectionCover";


const useStyles = makeStyles(theme => ({
   card: {
      width: "170px",
      background: "white !important",
      border: "2px solid rgba(0,0,0,0.1)",
      transition: "border 0.1s",
      "&:hover": {
         border: "2px solid rgba(0,0,0,0.7)",
      }
   }
}));

export default function BuildingCard(props: {
   card: cardInfo,
   small?: boolean
}) {
   const classes = useStyles();

   return (
      <SectionCover style={{height: !props.small ? "230px" : "auto"}} className={classes.card}>
         <GapContainer padding={"5px"} gap={"5px"}>
            <p>{props.card.name}</p>
            <p>CLASS - {props.card.cardClass}</p>
            <p>VALUE - {props.card.cost}</p>
         </GapContainer>
      </SectionCover>
   );
}
