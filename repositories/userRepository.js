const Repository = require("./repository");
const User = require("../models/user");

class UserRepository extends Repository {
  constructor(){
    super();
    this.model = User;
  }

  getUsersByIdsArray(idsArr , callback){
    this.model.find( { "_id": { $in : idsArr } }).exec(callback)
  }
}

module.exports = new UserRepository();