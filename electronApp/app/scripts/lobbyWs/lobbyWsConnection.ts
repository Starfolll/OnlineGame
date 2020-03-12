import {userAccountData} from "../../store/actions/account/account.actions.types";
import {globalLobbyMessagesResponse,} from "../../store/actions/globalLobby/globalLobby.actions.types";
import {roomActionsDeleteRoom} from "../../store/actions/room/room.actions";
import GetGlobalLobbyMessage from "./communicationWithLobby/globalLobby/informGlobalLobbyMessages";
import GlobalLobbyResponse from "./communicationWithLobby/globalLobby/reponseGlobalLobbyMessage";
import {lobbyActions} from "./communicationWithLobby/globalLobby/responeGlobalLobbyActions";


export default class LobbyWSConnection {
   public readonly wsUrl: string;
   public readonly account: userAccountData;
   public readonly socket: WebSocket;

   private readonly dispatch: Function;
   private readonly lobbyActions: lobbyActions;

   constructor(props: {
      wsUrl: string,
      account: userAccountData,
      dispatch: Function
   }) {
      this.wsUrl = props.wsUrl;
      this.account = props.account;
      this.socket = new WebSocket(this.wsUrl);

      this.dispatch = props.dispatch;

      this.lobbyActions = {
         sendMessage: ({message}) => this.socket.send(JSON.stringify({
            messageType: "globalLobbyChatMessage", message
         })),
         createNewPrivateRoom: () => this.socket.send(JSON.stringify({
            messageType: "createNewPrivateRoom"
         })),
         searchForPublicRoom: () => this.socket.send(JSON.stringify({
            messageType: "publicRoomSearch"
         })),
         inviteFriendToRoom: (userId: string, roomId: string) => this.socket.send(JSON.stringify({
            messageType: "sendInviteToRoom", userId, roomId
         })),
         connectToPrivateRoom: (roomId: string) => this.socket.send(JSON.stringify({
            messageType: "connectToPrivateRoom", roomId
         })),
         startGame: () => this.socket.send(JSON.stringify({
            messageType: "startGame"
         })),
         leaveRoom: () => {
            this.socket.send(JSON.stringify({
               messageType: "leaveRoom"
            }));
            this.dispatch(roomActionsDeleteRoom());
         },
      };

      this.SendInitialConnectionData();

      this.SocketAttachOnMessage();
      this.SocketAttachOnError();
      this.SocketAttachOnClose();
   }

   private SendInitialConnectionData(): void {
      this.socket.onopen = (e) => {
         this.socket.send(JSON.stringify(GetGlobalLobbyMessage.InitialConnection(
            this.account.id, this.account.token
         )));
      };
   }

   private SocketAttachOnMessage(): void {
      this.socket.onmessage = (e) => {
         const data: globalLobbyMessagesResponse = JSON.parse(e.data);

         console.log(data);
         switch (data.messageType) {
            case "lobbyInfo":
               GlobalLobbyResponse.LobbyInfo(this.dispatch, {
                  lobbyData: data.lobbyData,
                  lobbyActions: this.lobbyActions
               });
               break;

            case "userConnectedToRoom":
               GlobalLobbyResponse.RoomAddUser(this.dispatch, data.user);
               break;

            case "userRemovedFromRoom":
               GlobalLobbyResponse.RoomRemoveUser(this.dispatch, data.userId);
               break;

            case "privateRoomCreated":
               GlobalLobbyResponse.RoomInfo(this.dispatch, data.roomData);
               break;

            case "redirectToRoom":
               GlobalLobbyResponse.RoomInfo(this.dispatch, data.roomData);
               break;

            case "globalLobbyChatMessage":
               GlobalLobbyResponse.AddMessage(this.dispatch, data.message);
               break;

            case "friendsConnectedToGame":
               GlobalLobbyResponse.FriendsConnected(this.dispatch, data.friendsId);
               break;

            case "friendConnectedToLobby":
               GlobalLobbyResponse.FriendConnected(this.dispatch, data.friendId);
               break;

            case "friendDisconnectedFromLobby":
               GlobalLobbyResponse.FriendDisconnected(this.dispatch, data.friendId);
               break;

            case "inviteToRoom":
               GlobalLobbyResponse.InviteToRoom(this.dispatch, data.roomId, data.userId);
               break;
         }
      };
   }

   private SocketAttachOnClose(): void {
      this.socket.onclose = (e) => {
         console.log(e);
      };
   }

   private SocketAttachOnError(): void {
      this.socket.onerror = (e) => {
         console.log(e);
      };
   }
}
