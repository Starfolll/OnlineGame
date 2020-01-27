import CommandsSection from "./commander/commandsSections";


const commandsSections = new CommandsSection({
   name: "Online game",
   header: "DEV",
   currentDirPath: __dirname,
   commands: {
      "-build-all": {
         name: "build-all",
         actionDescription: "tsc && prisma deploy",
         cmd: [
            {cmd: "tsc"},
            {cmd: "prisma", cmdParams: ["deploy"]},
            {cmd: "sudo", cmdParams: "docker-compose down".split(" ")},
            {cmd: "sudo", ignoreLogs: true, cmdParams: "docker-compose up".split(" ")}
         ]
      }
   },
   sections: {
      "git": {
         name: "git",
         commands: {
            "-acp": {
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
            }
         }
      },
      "tsc": {
         name: "tsc",
         commands: {
            "-build": {
               name: "build",
               actionDescription: "build .ts files",
               cmd: [{
                  cmd: "tsc"
               }]
            }
         },
      },
      "pm2": {
         name: "pm2",
         commands: {
            "-list": {
               name: "list",
               actionDescription: "pm2 list",
               cmd: [{
                  cmd: "pm2",
                  cmdParams: ["list"],
               }]
            },
            "-monitor": {
               name: "monitor",
               actionDescription: "pm2 monit",
               cmd: [{
                  cmd: "pm2",
                  cmdParams: ["monit"],
               }],
               printGap: true
            },
            "-startup": {
               name: "startup",
               actionDescription: "pm2 startup",
               cmd: [{
                  cmd: "pm2",
                  cmdParams: ["startup"],
               }],
            },
            "-save-startup": {
               name: "save-startup",
               actionDescription: "pm2 save",
               cmd: [{
                  cmd: "pm2",
                  cmdParams: ["save"],
               }],
               printGap: true
            },
            "-start": {
               name: "start",
               actionDescription: "pm2 start {FILE_PATH} --name {APP_NAME} -- {ARGS}",
               cmd: [{
                  cmd: "pm2",
                  cmdParams: "start FILE_PATH --name APP_NAME -- ARGS".split(" "),
                  cmdConfigurableValues: ["FILE_PATH", "APP_NAME", "ARGS"]
               }],
            },
            "-restart": {
               name: "restart",
               actionDescription: "pm2 restart {APP_NAME}",
               cmd: [{
                  cmd: "pm2",
                  cmdParams: "restart APP_NAME".split(" "),
                  cmdConfigurableValues: ["APP_NAME"]
               }],
            },
            "-stop": {
               name: "stop",
               actionDescription: "pm2 stop {APP_NAME}",
               cmd: [{
                  cmd: "pm2",
                  cmdParams: "stop APP_NAME".split(" "),
                  cmdConfigurableValues: ["APP_NAME"]
               }],
            },
            "-delete": {
               name: "delete",
               actionDescription: "pm2 delete {APP_NAME}",
               cmd: [{
                  cmd: "pm2",
                  cmdParams: "delete APP_NAME".split(" "),
                  cmdConfigurableValues: ["APP_NAME"]
               }],
            },
            "-reload": {
               name: "reload",
               actionDescription: "pm2 reload {APP_NAME}",
               cmd: [{
                  cmd: "pm2",
                  cmdParams: "reload APP_NAME".split(" "),
                  cmdConfigurableValues: ["APP_NAME"]
               }],
               printGap: true
            },
            "-ecosystem": {
               name: "ecosystem",
               actionDescription: "pm2 ACTION[start|restart|stop|delete] ecosystem.config.js",
               cmd: [{
                  cmd: "pm2",
                  cmdParams: "ACTION ecosystem.config.js".split(" "),
                  cmdConfigurableValues: ["ACTION"]
               }],
            }
         }
      },
      "prisma": {
         name: "prisma",
         commands: {
            "-deploy": {
               name: "deploy",
               cmd: [{
                  cmd: "prisma",
                  cmdParams: ["deploy"]
               }]
            }
         }
      },
      "docker-compose": {
         name: "docker-compose",
         commands: {
            "-up": {
               name: "up",
               actionDescription: "docker-compose up",
               cmd: [{
                  cmd: "sudo",
                  cmdParams: "docker-compose up".split(" ")
               }]
            },
            "-down": {
               name: "down",
               actionDescription: "docker-compose down",
               cmd: [{
                  cmd: "sudo",
                  cmdParams: "docker-compose down".split(" ")
               }]
            }
         }
      },
   }
});

commandsSections.Enter(() => {
   console.clear();
   console.log(" bye ");
});