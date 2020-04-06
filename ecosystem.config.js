module.exports = {
   apps: [{
      name: "games-manager",
      script: "./server.js",
      args: "--server-mode-games-manager",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
   }, {
      name: "lobby-manager",
      script: "./server.js",
      args: "--server-mode-lobby-manager",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
   }, {
      name: "static-and-api",
      script: "./server.js",
      args: "--server-mode-static-and-api-serve",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
   }],

   deploy: {
      production: {
         user: "node",
         host: "212.83.163.1",
         ref: "origin/master",
         repo: "git@github.com:repo.git",
         path: "/var/www/production",
         "post-deploy": "npm install && pm2 reload ecosystem.config.js --env production"
      }
   }
};
