import {command} from "../command";
import {commandsSections} from "../commandsSections";
import {execSync} from "child_process";


const gitCommands = {
   acp: (): command => ({
      name: "acp",
      actionDescription: "git add . && git commit COMMIT_NAME && git push",
      cmd: [
         {
           cmd: "ls"
         },
         {
            cmd: "git",
            cmdParams: "add .".split(" "),
         },
         {
            cmd: "git",
            cmdParams: "commit -m COMMIT_NAME".split(" "),
            cmdConfigurableValues: "COMMIT_NAME".split(" ")
         },
         {
            cmd: "git",
            cmdParams: "push".split(" "),
         }
      ]
   }),
};

const gitCommandsSection: commandsSections = {
   name: "git",
   startCommand: () => execSync("git branch", {stdio: "inherit"}),
   commands: {
      "-acp": gitCommands.acp()
   }
};

export default gitCommandsSection;