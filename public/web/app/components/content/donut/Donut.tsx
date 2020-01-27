import React from "react";
import {Box, makeStyles} from "@material-ui/core";


import "./Donut.css";


const useStyles = makeStyles(theme => ({
   donutTopCircleStroke: {
      stroke: theme.palette.secondary.main
   }
}));

export default function Donut(props: {
   progress?: number,
   children?: any,
   radius: string,
   stroke?: string
}) {
   const classes = useStyles();

   const progress = props.progress ?? 0;
   const prefix = 'donut';
   const size = 34;

   const getClassName = (p: any, c: any) => `${p}${c}`;

   const halfSize = size / 2;
   const circleProps = {
      cx: halfSize,
      cy: halfSize,
      r: halfSize - 1
   };

   return (
      <Box
         style={{width: props.radius, height: props.radius}}
         className={getClassName(prefix, progress < 0 ? ' is--negative' : '')}
      >
         <Box style={{
            width: "100%",
            height: "100%",
            display: "grid",
            position: "absolute",
            top: 0,
            right: 0,
            justifyContent: "center",
            alignContent: "center",
            zIndex: 3
         }}>
            {props.children}
         </Box>

         <svg
            className={getClassName(prefix, '__canvas')}
            width={props.radius}
            height={props.radius}
            viewBox={`0 0 ${size} ${size}`}
            xmlns="http://www.w3.org/2000/svg"
         >
            <circle
               className={getClassName(prefix, '__frame')}
               {...circleProps}
            />

            <circle
               className={[classes.donutTopCircleStroke, getClassName(prefix, '__circle')].join(" ")}
               strokeDasharray={`${Math.abs(progress)} 100`}
               {...circleProps}
            />
         </svg>
      </Box>
   );
}