import CommandsSection from "./commander/commandsSections";
import commanderSections from "./commander/commandPacks";
import dotenv from "dotenv";


dotenv.config();
const commandsSections = new CommandsSection({
   name: "Online game",
   header: process.env.BUILD_MODE === "dev" ? "DEV" : "PROD",
   currentDirPath: __dirname,
   commands: {
      "-br": {
         name: "br",
         actionDescription: "builds server (tsc) and restart pm2 server",
         cmd: [
            {cmd: "prisma", cmdParams: ["deploy"]},
            {cmd: "tsc"},
            {cmd: "pm2", cmdParams: ["ecosystem", "restart"]},
         ]
      },
      "-up": {
         name: "up",
         actionDescription: "pm2 ecosystem",
         cmd: [{cmd: "pm2", cmdParams: ["start", "ecosystem.config.js"]}]
      }
   },
   sections: {
      ...commanderSections,
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
});

commandsSections.Enter(() => {
   console.clear();
   console.log(" bye ");
});
