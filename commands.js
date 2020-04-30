module.exports = {
   "name": "THE VOID",
   "header": " This files contains commands and their description. \n Editing is available by changing commands.js file. \n To enter section you need to print its name. \n To run command write: -<<commandName>>",
   "currentDirPath": "/home/starfolll/Proects/OnlineGame",
   "showHelp": true,
   "sections": {
      "electronApp": {
         "name": "electronApp",
         "currentDirPath": "/home/starfolll/Proects/OnlineGame/electronApp",
         "header": "",
         "showHelp": true,
         "sections": {},
         "commands": {
            "-dir": {
               "actionDescription": "",
               "cmd": [
                  {
                     "cmd": "dir",
                     "cmdParams": "",
                     "ignoreLogs": false
                  }
               ],
               "name": "dir"
            }
         }
      }
   },
   "commands": {
      "-rs": {
         "actionDescription": "restart ecosystem",
         "cmd": [
            {
               "cmd": "tsc",
               "cmdParams": "",
               "ignoreLogs": false
            },
            {
               "cmd": "pm2 delete ecosystem.config.js",
               "cmdParams": "",
               "ignoreLogs": false
            },
            {
               "cmd": "pm2 start ecosystem.config.js",
               "cmdParams": "",
               "ignoreLogs": false
            }
         ],
         "name": "rs"
      },
      "-monit": {
         "actionDescription": "pm2 monit",
         "cmd": [
            {
               "cmd": "pm2 monit",
               "cmdParams": "",
               "ignoreLogs": false
            }
         ],
         "name": "monit"
      }
   }
};
