const readlineSync = require("readline-sync");
const chalk = require("chalk");
const {spawnSync} = require("child_process");

class Command {
   constructor(command = {
      consoleName: "ls",
      consoleAction: "(ls)",
      cmd: "ls",
      cmdParams: [],
      confParams: []
   }) {
      this.consoleName = command.consoleName;
      this.consoleAction = command.consoleAction || "";
      this.cmd = command.cmd;
      this.cmdParams = command.cmdParams || [];
      this.confParams = command.confParams || [];
   }

   Display() {
      console.log(` |-|- ${(chalk.bgBlack.greenBright(this.consoleName)).padEnd(40)} -|- ${chalk.bgBlack(this.consoleAction)}`);
   }

   Spawn() {
      let params = [...this.cmdParams];

      for (const confName of this.confParams) {
         const replacer = (readlineSync.question(`> Input ${chalk.blueBright(confName)} > `)).replace(" ", "_");

         params = params.map(i => confName === i ? replacer : i);
      }

      console.log(`> ${this.cmd} ${[...params].join(" ")}`);
      console.log();

      const child = spawnSync(this.cmd, [...params], {stdio: "inherit"});

      if (!!child.error) console.error(child.error.toString());
      if (!!child.stdout) console.error(child.stdout.toString());
   }
}

class Commands {
   constructor(commands = {list: new Command()}) {
      this.commands = commands;
   }

   Display() {
      Object.keys(this.commands).forEach(c => this.commands[c].Display());
   }

   SpawnCommand(name) {
      const cmd = this.commands[name];
      if (!cmd) return console.error(" | No such command");
      else cmd.Spawn();
   }

   Enter() {
      while (true) {
         console.log();
         this.Display();
         console.log();

         const input = readlineSync.question("> ");
         if (input === "q") {
            console.clear();
            break;
         }
         if (input === "c") {
            console.clear();
            continue;
         }

         this.SpawnCommand(input);
         console.log();
      }
   }
}

class CommandsSections {
   constructor(sections = {
      section1: new Commands()
   }) {
      this.sections = sections;
   }

   Display() {
      Object.keys(this.sections).forEach(c => {
         console.log(` |- ${(chalk.bgBlack.cyanBright(c)).padEnd(42)} -|-`);
      });
   }

   EnterSection(name) {
      const cmd = this.sections[name];
      if (!cmd) return console.error(" | No such section");
      else cmd.Enter();
   }

   Enter() {
      while (true) {
         console.log();
         this.Display();
         console.log();

         const input = readlineSync.question("> ");
         if (!input) continue;
         if (input === "q") {
            console.clear();
            break;
         }
         if (input === "c") {
            console.clear();
            continue;
         }

         this.EnterSection(input);
         console.log();
      }
   }
}

const sections = new CommandsSections({
   "tsc": new Commands({
      "tsc": new Command({
         consoleName: "tsc",
         cmd: "tsc",
      }),
   }),
   "prisma": new Commands({
      "deploy": new Command({
         consoleName: "deploy",
         cmd: "prisma",
         cmdParams: ["deploy"]
      }),
   }),
   "pm2": new Commands({
      "list": new Command({
         consoleName: "list",
         consoleAction: "(pm2 list)",
         cmd: "pm2",
         cmdParams: ["list"],
      }),
      "monit": new Command({
         consoleName: "monit",
         consoleAction: "(pm2 monit)",
         cmd: "pm2",
         cmdParams: ["monit"],
      }),
      "start": new Command({
         consoleName: "start",
         consoleAction: "(pm2 start app_name)",
         cmd: "pm2",
         cmdParams: "start APP_NAME".split(" "),
         confParams: ["APP_NAME"]
      }),
      "restart": new Command({
         consoleName: "restart",
         consoleAction: "(pm2 restart app_name)",
         cmd: "pm2",
         cmdParams: "restart APP_NAME".split(" "),
         confParams: ["APP_NAME"]
      }),
      "stop": new Command({
         consoleName: "stop",
         consoleAction: "(pm2 stop app_name)",
         cmd: "pm2",
         cmdParams: "stop APP_NAME".split(" "),
         confParams: ["APP_NAME"]
      }),
      "delete": new Command({
         consoleName: "delete",
         consoleAction: "(pm2 delete app_name)",
         cmd: "pm2",
         cmdParams: "delete APP_NAME".split(" "),
         confParams: ["APP_NAME"]
      }),
      "reload": new Command({
         consoleName: "reload",
         consoleAction: "(pm2 reload APP_NAME)",
         cmd: "pm2",
         cmdParams: "reload APP_NAME".split(" "),
         confParams: ["APP_NAME"]
      }),
   }),
   "git": new Commands({
      "push": new Command({
         consoleName: "push",
         consoleAction: "(git push)",
         cmd: "git",
         cmdParams: ["push"],
      }),
      "add": new Command({
         consoleName: "add",
         consoleAction: "(git add .)",
         cmd: "git",
         cmdParams: ["add", "."],
      }),
      "commit": new Command({
         consoleName: "commit",
         consoleAction: "(git commit COMMIT_NAME)",
         cmd: "git",
         cmdParams: "commit -m COMMIT_NAME".split(" "),
         confParams: ["COMMIT_NAME"]
      })
   })
});

sections.Enter();