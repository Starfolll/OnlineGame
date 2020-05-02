const {execSync} = require("child_process");


const gitCommands = {
   acp: () => ({
      name: "acp",
      actionDescription: "git add . && git commit COMMIT_NAME && git push",
      cmd: [
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

const gitCommandsSection = {
   name: "git",
   startCommand: () => execSync("git branch", {stdio: "inherit"}),
   commands: {
      "-acp": gitCommands.acp()
   }
};

module.exports = gitCommandsSection;
