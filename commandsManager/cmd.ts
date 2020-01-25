import readlineSync from "readline-sync";
import chalk from "chalk";
import {spawnSync} from "child_process";

export type cmd = {
   readonly cmd: string;
   readonly cmdParams?: Array<string>;
   readonly cmdConfigurableValues?: Array<string>;
}

export default class Cmd {
   private readonly cmd: string;
   private readonly cmdParams: Array<string>;
   private readonly cmdConfigurableValues: Array<string>;


   constructor(cmd: cmd) {
      this.cmd = cmd.cmd;
      this.cmdParams = cmd.cmdParams ?? [];
      this.cmdConfigurableValues = cmd.cmdConfigurableValues ?? [];
   }


   Spawn() {
      let params = [...this.cmdParams];

      for (const confName of this.cmdConfigurableValues) {
         const replacer = (readlineSync.question(`> Input ${chalk.blueBright(confName)} > `)).split(" ").join("_");

         params = params.map(i => confName === i ? replacer : i);
      }

      console.log(`> ${this.cmd} ${[...params].join(" ")}`);
      console.log();

      const child = spawnSync(this.cmd, [...params], {stdio: "inherit"});

      if (!!child.error) console.error(child.error.toString());
      if (!!child.stdout) console.error(child.stdout.toString());
   }
}