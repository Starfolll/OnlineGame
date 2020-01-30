import {commandsSections} from "../commandsSections";
import {command} from "../command";


const pm2Commands = {
   list: (): command => ({
      name: "list",
      actionDescription: "pm2 list",
      cmd: [{
         cmd: "pm2",
         cmdParams: ["list"],
      }]
   }),
   monit: (): command => ({
      name: "monit",
      actionDescription: "pm2 monit",
      cmd: [{
         cmd: "pm2",
         cmdParams: ["monit"],
      }],
   }),
   monitor: (): command => ({
      name: "monitor",
      actionDescription: "pm2 monitor",
      cmd: [{
         cmd: "pm2",
         cmdParams: ["monitor"],
      }],
   }),
   startup: (): command => ({
      name: "startup",
      actionDescription: "pm2 startup",
      cmd: [{
         cmd: "pm2",
         cmdParams: ["startup"],
      }],
   }),
   saveStartup: (): command => ({
      name: "save-startup",
      actionDescription: "pm2 save",
      cmd: [{
         cmd: "pm2",
         cmdParams: ["save"],
      }],
   }),
   start: (): command => ({
      name: "start",
      actionDescription: "pm2 start {FILE_PATH} --name {APP_NAME} -- {ARGS}",
      cmd: [{
         cmd: "pm2",
         cmdParams: "start FILE_PATH --name APP_NAME -- ARGS".split(" "),
         cmdConfigurableValues: ["FILE_PATH", "APP_NAME", "ARGS"]
      }],
   }),
   restart: (): command => ({
      name: "restart",
      actionDescription: "pm2 restart {APP_NAME}",
      cmd: [{
         cmd: "pm2",
         cmdParams: "restart APP_NAME".split(" "),
         cmdConfigurableValues: ["APP_NAME"]
      }]
   }),
   stop: (): command => ({
      name: "stop",
      actionDescription: "pm2 stop {APP_NAME}",
      cmd: [{
         cmd: "pm2",
         cmdParams: "stop APP_NAME".split(" "),
         cmdConfigurableValues: ["APP_NAME"]
      }],
   }),
   delete: (): command => ({
      name: "delete",
      actionDescription: "pm2 delete {APP_NAME}",
      cmd: [{
         cmd: "pm2",
         cmdParams: "delete APP_NAME".split(" "),
         cmdConfigurableValues: ["APP_NAME"]
      }],
   }),
   reload: (): command => ({
      name: "reload",
      actionDescription: "pm2 reload {APP_NAME}",
      cmd: [{
         cmd: "pm2",
         cmdParams: "reload APP_NAME".split(" "),
         cmdConfigurableValues: ["APP_NAME"]
      }],
   }),
   ecosystem: (): command => ({
      name: "ecosystem",
      actionDescription: "pm2 ACTION[start|restart|stop|delete] ecosystem.config.js",
      cmd: [{
         cmd: "pm2",
         cmdParams: "ACTION ecosystem.config.js".split(" "),
         cmdConfigurableValues: ["ACTION"]
      }],
   }),
   save: (): command => ({
      name: "save",
      actionDescription: "pm2 save",
      cmd: [{
         cmd: "pm2",
         cmdParams: "save".split(" "),
      }],
   })
};

const pm2CommandsSection: commandsSections = {
   name: "pm2",
   commands: {
      "-list": pm2Commands.list(),
      "-monit": {...pm2Commands.monit(), printGap: true},

      "-monitor": {...pm2Commands.monitor(), printGap: true},

      "-startup": pm2Commands.startup(),
      "-save": pm2Commands.save(),
      "-save-startup": {...pm2Commands.saveStartup(), printGap: true},

      "-start": pm2Commands.start(),
      "-restart": pm2Commands.restart(),
      "-stop": pm2Commands.stop(),
      "-delete": pm2Commands.delete(),
      "-reload": {...pm2Commands.reload(), printGap: true},

      "-ecosystem": pm2Commands.ecosystem()
   }
};

export default pm2CommandsSection;