import React from "react";
import {Spring} from "react-spring/renderprops-universal";


export default function ElementTransition(props: {
   delay?: number,
   children?: any
}) {
   const delay = props.delay ?? 0;

   return (
      <Spring
         from={{ opacity: 0 }}
         to={{ opacity: 1 }}
         delay={delay}
      >
         {(springProps) => <div style={springProps}>
            {props.children}
         </div>}
      </Spring>
   );
}