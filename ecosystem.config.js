module.exports = {
   apps : [{
      name: "static-and-api",
      script: "node server.js --server-mode-static-and-api-serve",
      max_memory_restart: "1G",
      transactions: true,
      http: true
   }, {
      name: "lobby-manager",
      script: "node server.js --server-mode-lobby-manager",
      max_memory_restart: "1G"
   }, {
      name: "games-manager",
      script: "node server.js --server-mode-games-manager",
      max_memory_restart: "1G",
      transactions: true,
      http: true
   }]
};