import React from "react";
import {Spring} from "react-spring/renderprops-universal";


export default function ElementTransition(props: any) {
   return (
      <Spring
         from={{ opacity: 0 }}
         to={{ opacity: 1 }}
      >
         {(springProps) => <div style={springProps}>
            {props.children}
         </div>}
      </Spring>
   );
}