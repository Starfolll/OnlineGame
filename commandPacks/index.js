const gitCommandsSection = require("./commander.pack.git");
const pm2CommandsSection = require("./commander.pack.pm2");

const commanderSections = {
   "git": gitCommandsSection,
   "pm2": pm2CommandsSection
};

module.exports = commanderSections;
