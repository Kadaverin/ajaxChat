const Repository = require("./repository");
const Message = require("../models/message");

class MessageRepository extends Repository {
  constructor(){
    super();
    this.model = Message;
  }

  getLastMessages(amount, callback){
    this.model.find().sort( {"created_at" : -1}).limit(amount).exec(callback)
  }
}

module.exports = new MessageRepository();
