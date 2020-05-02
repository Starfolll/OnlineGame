import {combineReducers} from "redux";
import accountReducer from "./account.reducer";


export const rootReducer = combineReducers({
   account: accountReducer
});

export type rootReducerTypes = ReturnType<typeof rootReducer>