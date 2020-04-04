import {combineReducers} from "redux";
import accountReducer from "./account.reducer";
import globalLobbyReducer from "./globalLobby.reducer";
import roomReducer from "./room.reducer";
import tableReducer from "./table.reducer";


export const rootReducer = combineReducers({
   account: accountReducer,
   globalLobby: globalLobbyReducer,
   room: roomReducer,
   table: tableReducer
});


export type rootReducerTypes = ReturnType<typeof rootReducer>;
