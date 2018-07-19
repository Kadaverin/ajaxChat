const UserRepository = require("../repositories/userRepository");
const MessageRepository = require("../repositories/messageRepository");

module.exports = {
  all: callback => {
    UserRepository.getAll((err, data) => {
      callback(null, data);
    });
  },

  findOne: (id, callback) => {
    UserRepository.getById(id, (err, data) => {
      if (!data && !err) err = new Error('Document not found');
      callback(err, data);
    });
  },

  createNewUser: (userInfo, callback) => {
    UserRepository.create(userInfo , (err, newUser) => {
      callback(err, newUser);
    })
  },

  updateUserById: (id, params, callback) => {
     UserRepository.updateById( id , params , (err, updatedUser) => {
       callback(err,  updatedUser)
     });
  },

  deleteUserById: (id, callback) => {
    UserRepository.deleteById( id, (err) => {
      callback(err);
    })
  },

};
