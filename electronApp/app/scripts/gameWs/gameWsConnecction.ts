import {userAccountData} from "../../store/actions/account/account.actions.types";
import GetGameMessage from "./communicationWithLobby/informGameMessages";

export default class GameWsConnection {
   public readonly wsUrl: string;
   public readonly account: userAccountData;
   public readonly socket: WebSocket;
   public readonly tableId: string;

   private readonly dispatch: Function;

   constructor(props: {
      tableId: string,
      wsUrl: string,
      account: userAccountData,
      dispatch: Function
   }) {
      this.wsUrl = props.wsUrl;
      this.account = props.account;
      this.dispatch = props.dispatch;
      this.tableId = props.tableId;

      this.socket = new WebSocket(this.wsUrl);

      this.SendInitialConnectionData();

      this.SocketAttachOnMessage();
      this.SocketAttachOnError();
      this.SocketAttachOnClose();
   }

   private SendInitialConnectionData(): void {
      this.socket.onopen = (e) => {
         this.socket.send(JSON.stringify(GetGameMessage.InitialConnection(
            this.account.id,
            this.account.token,
            this.tableId
         )));
      };
   }

   private SocketAttachOnMessage(): void {
      this.socket.onmessage = (e) => {
         const data: any = JSON.parse(e.data);
         console.log(data);
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
