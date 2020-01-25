const readlineSync = require('readline-sync');
const chalk = require("chalk");
const {spawnSync} = require('child_process');

class Command {
   constructor(command = {
      consoleName: "list",
      consoleAction: "(pm2 apps list)",
      cmd: "pm2",
      cmdParams: ["list"],
      confParams: []
   }) {
      this.consoleName = command.consoleName;
      this.consoleAction = command.consoleAction || "";
      this.cmd = command.cmd;
      this.cmdParams = command.cmdParams || [];
      this.confParams = command.confParams || [];
   }

   Display() {
      console.log(` |- ${(chalk.greenBright(this.consoleName)).padEnd(30)} -|- ${this.consoleAction}`);
   }

   Spawn() {
      const addConf = [];
      for (const param of this.confParams) addConf.push(readlineSync.question(
         `> Input ${chalk.blueBright(param)} > `,
      ));

      console.log(`> ${this.cmd} ${[...this.cmdParams, ...addConf].join(" ")}`);
      console.log();

      const child = spawnSync(this.cmd, [...this.cmdParams, ...addConf], {stdio: "inherit"});

      if (!!child.error) console.error(child.error.toString());
      if (!!child.stdout) console.error(child.stdout.toString());
   }
}

class Pm2Commands {
   constructor(commands = {list: new Command()}) {
      this.commands = commands;
   }

   DisplayCommands() {
      Object.keys(this.commands).forEach(c => this.commands[c].Display());
   }

   SpawnCommand(name) {
      const cmd = this.commands[name];
      if (!cmd) return console.error(" | No such command");
      else cmd.Spawn();
   }
}


const commands = new Pm2Commands({
   "tsc": new Command({
      consoleName: "tsc",
      cmd: "tsc",
   }),
   "l": new Command({
      consoleName: "l",
      consoleAction: "(pm2 list)",
      cmd: "pm2",
      cmdParams: ["list"],
   }),
   "m": new Command({
      consoleName: "m",
      consoleAction: "(pm2 monit)",
      cmd: "pm2",
      cmdParams: ["monit"],
   }),
   "start": new Command({
      consoleName: "start",
      consoleAction: "(pm2 start app_name)",
      cmd: "pm2",
      cmdParams: ["start"],
      confParams: ["app_name (all, id, name)"]
   }),
   "restart": new Command({
      consoleName: "restart",
      consoleAction: "(pm2 restart app_name)",
      cmd: "pm2",
      cmdParams: ["restart"],
      confParams: ["app_name (all, id, name)"]
   }),
   "stop": new Command({
      consoleName: "stop",
      consoleAction: "(pm2 stop app_name)",
      cmd: "pm2",
      cmdParams: ["stop"],
      confParams: ["app_name (all, id, name)"]
   }),
   "delete": new Command({
      consoleName: "delete",
      consoleAction: "(pm2 delete app_name)",
      cmd: "pm2",
      cmdParams: ["delete"],
      confParams: ["app_name (all, id, name)"]
   }),
   "reload": new Command({
      consoleName: "reload",
      consoleAction: "(pm2 reload app_name)",
      cmd: "pm2",
      cmdParams: ["reload"],
      confParams: ["app_name (all, id, name)"]
   }),
});

while (true) {
   console.log();
   commands.DisplayCommands();
   console.log();

   const input = readlineSync.question("> ");
   if (input === "q") break;
   if (input === "c") {
      console.clear();
      continue;
   }

   commands.SpawnCommand(input);
   console.log();
}