const users = require("./users");
const messages = require("./messages");



module.exports = function(app) {
  app.use("/api/users", users );
  app.use("/api/messages", messages);
};

 
