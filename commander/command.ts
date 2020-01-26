import chalk from "chalk";
import Cmd, {cmd} from "./cmd";


export type command = {
   readonly name: string;
   readonly actionDescription?: string;
   readonly cmd: Array<cmd>;
   readonly deep?: number;
}

export default class Command {
   public readonly name: string;
   public readonly actionDescription: string;

   private readonly cmd: Array<Cmd>;

   private readonly deep: number;


   constructor(command: command) {
      this.name = command.name;
      this.actionDescription = command.actionDescription ?? "";

      this.cmd = command.cmd.map(c => new Cmd(c));

      this.deep = command.deep ?? 1;
   }

   public Show(): void {
      console.log(` ${"|-".repeat(this.deep)} ${(chalk.greenBright(this.name)).padEnd(60 - this.deep * 2)} ${!!this.actionDescription ? " | " : ""} ${chalk(this.actionDescription)}`);
   }

   public Execute(): void {
      for (let i = 0; i < this.cmd.length; i++)
         this.cmd[i].Spawn();
   }
}