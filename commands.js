const commandsSection = require("./commandPacks/index");

module.exports = {
   name: "Online game",
   header: process.env.BUILD_MODE === "dev" ? "DEV" : "PROD",
   currentDirPath: process.cwd(),
   commands: {
      "-br": {
         name: "br",
         actionDescription: "builds server (tsc) and restart pm2 server",
         cmd: [
            {cmd: "prisma", cmdParams: ["deploy"]},
            {cmd: "tsc"},
            {cmd: "pm2", cmdParams: ["restart", "ecosystem.config.js"]},
         ]
      },
      "-up": {
         name: "up",
         actionDescription: "pm2 ecosystem",
         cmd: [{cmd: "pm2", cmdParams: ["restart", "ecosystem.config.js"]}]
      }
   },
   sections: {
      ...commandsSection,
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
};
