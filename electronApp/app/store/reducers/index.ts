import {combineReducers} from "redux";
import accountReducer from "./account.reducer";
import globalLobbyReducer from "./globalLobby.reducer";
import roomReducer from "./room.reducer";
import gameTableReducer from "./gameTable.reducer";


export const rootReducer = combineReducers({
   account: accountReducer,
   globalLobby: globalLobbyReducer,
   room: roomReducer,
   gameTable: gameTableReducer
});


export type rootReducerTypes = ReturnType<typeof rootReducer>;
