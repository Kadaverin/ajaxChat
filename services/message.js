const MessageRepository = require("../repositories/messageRepository");

module.exports = {
  all: callback => {
    MessageRepository.getAll((err, data) => {
      callback(null, data);
    });
  },

  findOne: (id, callback) => {
    MessageRepository.getById(id, (err, data) => {
      if (!data && !err) err = new Error('Document not found');
      callback(err, data);
    });
  },

  createNewMessage: (params, callback) => {
     MessageRepository.create(params , (err, newMessage) => {
       callback(err, newMessage);
     })
  },

  updateMessageById: (id, params, callback) => {
     MessageRepository.updateById( id , {text: params.text} , (err, updatedMessage) => {
       callback(err, updatedMessage);
     });
  },

  deleteMessageById: (id, callback) => {
    MessageRepository.deleteById( id, (err) => {
       callback(err);
    })
  },
  getLastMessages: (amount, callback) => {
    MessageRepository.getLastMessages(Number(amount) , (err, msg) => {
      callback(err , msg)
    })
  }
  
};