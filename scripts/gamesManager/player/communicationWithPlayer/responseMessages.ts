import {
    playerInitialConnection,
    initialHeroTurnOptions,
    initialHeroCardPicked,
    initialHeroTurnOptionPicked,
    heroPicked,
    buildTurnMade,
    builtDistrict
} from "./responseMessagesTypes";


export class IsMessageValid {
    static GetValidPlayerInitialConnection(message: any): playerInitialConnection | undefined {
        if (typeof message !== "object") return undefined;
        if (!message["messageType"] && message["messageType"] !== "playerInitialConnection") return undefined;
        if (!message["name"] && typeof message["name"] !== "string") return undefined;
        if (!message["token"] && typeof message["token"] !== "string") return undefined;
        if (!message["id"] && typeof message["id"] !== "number") return undefined;
        if (!message["tableId"] && typeof message["tableId"] !== "number") return undefined;
        return message as playerInitialConnection;
    }

    static GetValidHeroPickedMessage(message: any): heroPicked | undefined {
        if (typeof message !== "object") return undefined;
        if (!message["messageType"] && message["messageType"] !== "heroPicked") return undefined;
        if (!message["heroWeight"] && typeof message["heroWeight"] !== "number") return undefined;
        return message as heroPicked;
    }

    static GetValidInitialHeroTurnOptionPicked(message: any): initialHeroTurnOptionPicked | undefined {
        if (typeof message !== "object") return undefined;
        if (!message["messageType"] && message["messageType"] !== "initialHeroTurnOptionPicked") return undefined;
        if (!message["pickedOption"] && !initialHeroTurnOptions.has(message["pickedOption"])) return undefined;
        return message as initialHeroTurnOptionPicked;
    }

    static GetValidInitialHeroCardPicked(message: any): initialHeroCardPicked | undefined {
        if (typeof message !== "object") return undefined;
        if (!message["messageType"] && message["messageType"] !== "initialHeroCardPicked") return undefined;
        if (!message["cardInGameId"] && typeof message["cardInGameId"] !== "number") return undefined;
        return message as initialHeroCardPicked;
    }

    static GetValidBuiltDistrict(message: any): builtDistrict | undefined {
        if (typeof message !== "object") return undefined;
        if (!message["messageType"] && message["messageType"] !== "builtDistrict") return undefined;
        if (!message["cardInGameId"] && typeof message["cardInGameId"] !== "number") return undefined;
        return message as builtDistrict;
    }

    static GetValidBuildTurnMade(message: any): buildTurnMade | undefined {
        if (typeof message !== "object") return undefined;
        if (!message["messageType"] && message["messageType"] !== "buildTurnMade") return undefined;
        return message as buildTurnMade;
    }
}