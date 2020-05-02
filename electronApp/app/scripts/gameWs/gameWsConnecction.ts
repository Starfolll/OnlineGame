import {userAccountData} from "../../store/actions/account/account.actions.types";
import {
   tableActionSetHeroesWeightToPickFrom,
   tableActionSetInitialTurnOptions,
   tableActionsSetBuildLimit, tableActionsSetPlayerAbilityTurnType,
   tableActionsSetProposedCards
} from "../../store/actions/table/table.actions";
import {gameTableMessagesResponse, heroAbilityTypes} from "../../store/actions/table/table.actions.types";
import GetGameMessage from "./communicationWithLobby/informGameMessages";
import {initialHeroTurnOptions} from "./communicationWithLobby/informGameMessages.types";
import {tableActions} from "./communicationWithLobby/responseTableActions";
import GameTableResponse from "./communicationWithLobby/responseTableMessage";

export default class GameWsConnection {
   public readonly wsUrl: string;
   public readonly account: userAccountData;
   public readonly socket: WebSocket;
   public readonly tableId: string;

   private readonly dispatch: Function;
   private readonly tableActions: tableActions;

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

      this.tableActions = {
         pickHero: (hw: number) => {
            this.socket.send(JSON.stringify(GetGameMessage.HeroPicked(hw)));
            this.dispatch(tableActionSetHeroesWeightToPickFrom(undefined));
         },

         pickInitialOption: (option: initialHeroTurnOptions) => {
            this.socket.send(JSON.stringify(GetGameMessage.InitialHeroTurnOptionPicked(option)));
            this.dispatch(tableActionSetInitialTurnOptions(undefined));
         },

         pickInitialCard: (cardInGameId: number) => {
            this.socket.send(JSON.stringify(GetGameMessage.InitialHeroCardPicked(cardInGameId)));
            this.dispatch(tableActionsSetProposedCards(undefined));
         },

         useHeroAbility: (abilityType: heroAbilityTypes, abilityData: any) => {
            this.socket.send(JSON.stringify(GetGameMessage.HeroAbilityUsed(abilityType, abilityData)));
            this.dispatch(tableActionsSetPlayerAbilityTurnType(undefined));
         },

         builtDistrict: (cardInGameId: number) => {
            this.socket.send(JSON.stringify(GetGameMessage.BuiltDistrict(cardInGameId)));
            if (cardInGameId === -1) this.dispatch(tableActionsSetBuildLimit(undefined));
         }
      };

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
         const data: gameTableMessagesResponse = JSON.parse(e.data);

         console.log(data);
         switch (data.messageType) {
            case "tableInfo":
               GameTableResponse.GameTableInfo(this.dispatch, {
                  table: data.gameTable,
                  actions: this.tableActions
               });
               break;

            case "heroPickTurnStart":
               GameTableResponse.HeroPickTurnStart(
                  this.dispatch,
                  data.heroesShiftedWeight,
                  data.playerIdTurn,
                  data.heroesWeightLeft
               );
               break;

            case "pickHero":
               GameTableResponse.PickHero(
                  this.dispatch,
                  data.playerIdTurn,
                  data.heroesWeightLeft
               );
               break;

            case "heroInitialTurnStarted":
               GameTableResponse.HeroInitialTurnStarted(
                  this.dispatch,
                  data.playerId,
                  data.heroId,
                  data.options
               );
               break;

            case "pickOneOfProposedCards":
               GameTableResponse.PickOneOfProposedCards(
                  this.dispatch,
                  data.cards
               );
               break;

            case "heroBuildTurnStarted":
               GameTableResponse.HeroBuildTurnStarted(
                  this.dispatch,
                  data.playerId,
                  data.buildLimit
               );
               break;

            case "playerBuiltDistrict":
               GameTableResponse.PlayerBuiltDistrict(
                  this.dispatch,
                  data.playerId,
                  data.card
               );
               break;

            case "playerReceivedGold":
               GameTableResponse.PlayerReceivedGold(
                  this.dispatch,
                  data.count,
                  data.playerId
               );
               break;

            case "playerReceivedCard":
               GameTableResponse.PlayerReceivedCard(
                  this.dispatch,
                  data.card,
                  data.playerId
               );
               break;

            case "heroAbilityTurnStarted":
               GameTableResponse.HeroAbilityTurnStarted(
                  this.dispatch,
                  data.heroAbilityType,
               );
               break;

            case "gameEnd":
               GameTableResponse.GameEnd(
                  this.dispatch,
                  data.scoreTable
               );
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
