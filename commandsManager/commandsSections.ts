import Command, {command} from "./command";
import chalk from "chalk";
import readlineSync from "readline-sync";


export type commandsSections = {
   name: string;
   sections?: { [name: string]: commandsSections };
   commands?: { [name: string]: command };
   deep?: number;
}

export default class CommandsSections {
   public readonly name: string;
   private readonly deep: number;

   private readonly sections: { [name: string]: CommandsSections };
   private readonly commands: { [name: string]: Command };


   constructor(commandsSections: commandsSections) {
      this.name = commandsSections.name;
      this.deep = commandsSections.deep ?? 1;

      this.sections = {};
      if (!!commandsSections.sections) for (const section in commandsSections.sections)
         this.sections[section] = new CommandsSections(({...commandsSections.sections[section], deep: this.deep + 1}));

      this.commands = {};
      if (!!commandsSections.commands) for (const command in commandsSections.commands)
         this.commands[command] = new Command(({...commandsSections.commands[command], deep: this.deep + 1}));
   }

   public ShowTitle(): void {
      console.log(` ${"|-".repeat(this.deep)} >${chalk.underline.blueBright(this.name)}<`);
   }

   public ShowSectionTitle(): void {
      console.log(` ${"|-".repeat(this.deep)} ${chalk.underline.blueBright(this.name)}`);
   }

   public Show(): void {
      console.log();
      this.ShowTitle();

      if (Object.keys(this.sections).length > 0) console.log();
      Object.keys(this.sections).forEach(s => this.sections[s].ShowSectionTitle());

      if (Object.keys(this.commands).length > 0) console.log();
      Object.keys(this.commands).forEach(c => this.commands[c].Show());

      console.log();
   }

   public SpawnCommand(commandName: string): void {
      const command = this.commands[commandName];
      if (!command) return console.error(" | No such command");
      else command.Execute();
   }

   public EnterSection(sectionName: string): void {
      const section = this.sections[sectionName];
      if (!section) return console.error(" | No such section");
      else section.Enter();
   }

   public Enter(): void {
      while (true) {
         this.Show();

         const input = readlineSync.question("> ");
         if (!input) continue;
         if (input === "q") break;
         if (input === "c") {
            console.clear();
            continue;
         }

         if (input[0] === "-") this.SpawnCommand(input);
         else this.EnterSection(input);
      }
   }
}