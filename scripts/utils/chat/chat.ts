export default class Chat<T> {
   public readonly messages: Array<T> = [];
   public readonly startMessages: Array<T> = [];
   public readonly maxSavedMessages: number;

   constructor(maxSavedMessages: number, startMessages?: Array<T>) {
      this.maxSavedMessages = maxSavedMessages;
      this.startMessages = startMessages ?? [];
   }

   public AddMessage(message: T): void {
      this.messages.push(message);

      if (this.messages.length > this.maxSavedMessages) this.messages.shift();
   }

   public GetMessages(): Array<T> {
      return this.messages;
   }

   public GetStartMessages(): Array<T> {
      return this.startMessages;
   }
}
