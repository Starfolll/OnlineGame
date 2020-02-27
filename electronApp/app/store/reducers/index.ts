import {combineReducers} from "redux";
import accountReducer from "./account.reducer";
import globalLobbyReducer from "./globalLobby.reducer";
import roomReducer from "./room.reducer";


export const rootReducer = combineReducers({
   account: accountReducer,
   globalLobby: globalLobbyReducer,
   room: roomReducer
});


export type rootReducerTypes = ReturnType<typeof rootReducer>;
