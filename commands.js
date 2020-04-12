const commandsSection = require("./commandPacks/index");

module.exports = {
   commands: {
      "-br": {
         name: "br",
         actionDescription: "builds and restart prisma tsc pm2",
         cmd: [
            {cmd: "prisma", cmdParams: "deploy"},
            {cmd: "tsc"},
            {cmd: "pm2", cmdParams: "start ecosystem.config.js"},
         ]
      },
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
