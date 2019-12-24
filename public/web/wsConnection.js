let socket;

let id = "null";
let token = "null";

// lobby
const connectToLobby = () => {
   socket = new WebSocket(`ws://${window.location.hostname}:8081`);

   socket.onopen = () => {
      socket.send(JSON.stringify({
         "messageType": "playerInitialConnection",
         "token": token,
         "id": id,
      }));
   };

   socket.onmessage = (e) => {
      console.log(JSON.parse(e.data));
   };

   socket.onerror = (err) => console.error(" | connection error", err);
   socket.onclose = (err) => console.error(" | connection close", err.reason);
};

const sendLobbyChatMessage = (message) => {
   socket.send(JSON.stringify({
      "messageType": "globalLobbyChatMessage",
      "message": message
   }));
};

const searchForRoom = () => {
   socket.send(JSON.stringify({
      "messageType": "publicLobbySearch",
   }));
};

const sendRoomChatMessage = (message) => {
   socket.send(JSON.stringify({
      "messageType": "roomChatMessage",
      "message": message
   }));
};

const leaveRoom = () => {
   socket.send(JSON.stringify({
      "messageType": "leaveRoom"
   }));
};

// game
const connectToGame = (tableId) => {
   socket = new WebSocket(`ws://${window.location.hostname}:8080`);

   socket.onopen = () => {
      socket.send(JSON.stringify({
         "messageType": "playerInitialConnection",
         "token": token,
         "id": id,
         "tableId": tableId
      }));
   };

   socket.onmessage = (e) => {
      console.log(JSON.parse(e.data));
   };

   socket.onerror = (err) => console.error(" | connection error", err);
   socket.onclose = (err) => console.error(" | connection close", err.reason);
};

const pickHero = (heroId) => {
   socket.send(JSON.stringify({
      "messageType": "heroPicked",
      "heroWeight": heroId
   }));
};

const pickOption = (option) => {
   socket.send(JSON.stringify({
      "messageType": "initialHeroTurnOptionPicked",
      "pickedOption": option
   }));
};

const pickCard = (cardInGameId) => {
   socket.send(JSON.stringify({
      "messageType": "initialHeroCardPicked",
      "cardInGameId": cardInGameId
   }));
};

const build = (cardInGameId) => {
   socket.send(JSON.stringify({
      "messageType": "buildDistrict",
      "cardInGameId": cardInGameId
   }));
};

const endBuildTurn = () => {
   socket.send(JSON.stringify({
      "messageType": "buildTurnMade",
   }));
};

const sendGameChatMessage = (message) => {
   socket.send(JSON.stringify({
      "messageType": "chatMessage",
      "message": message
   }));
};

const useAbility = {
   "killHero": (heroWeight) => {
      socket.send(JSON.stringify({
         "messageType": "heroAbilityUsed",
         "abilityData": {
            "messageType": "heroKilled",
            "killedHeroWeight": heroWeight
         }
      }));
   },
   "robbHero": (heroWeight) => {
      socket.send(JSON.stringify({
         "messageType": "heroAbilityUsed",
         "abilityData": {
            "messageType": "robbHero",
            "heroWeight": heroWeight
         }
      }));
   },
   "changeHand": (playerId) => {
      socket.send(JSON.stringify({
         "messageType": "heroAbilityUsed",
         "abilityData": {
            "messageType": "changeHand",
            "playerId": playerId
         }
      }));
   },
   "districtDestroyed": (playerId, districtInGameId) => {
      socket.send(JSON.stringify({
         "messageType": "heroAbilityUsed",
         "abilityData": {
            "messageType": "districtDestroyed",
            "playerId": playerId,
            "districtInGameId": districtInGameId
         }
      }));
   }
};