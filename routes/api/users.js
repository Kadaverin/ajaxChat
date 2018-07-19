const router = require("express").Router();
const UserService = require("../../services/user");
const responseHandler = require("../../helpers/responseHandler");

router.get("/", (req, res, next) => {
  UserService.all(  (err, data) =>  responseHandler(err, data , res) )
});

router.get("/:id", (req, res, next) => {
  UserService.findOne(req.params.id, (err, user) => {
    responseHandler(err, user , res) 
  });
});

router.put('/:id' , (req, res, next) => {
  UserService.updateUserById(req.params.id, req.body, (err, updatedUser) => {
    responseHandler(err, updatedUser, res);
  })
})

router.delete('/:id' , (req, res, next) => {
  UserService.deleteUserById(req.params.id, (err) => {
   if(!err){
      res.json({ message: 'Successfully deleted' });
   }else{
      res.status( 400 );
      res.end();
   }
  })
})

router.post('/' , (req, res, next) => {
    UserService.createNewUser(req.body , (err , newUser) => {
      responseHandler(err, newUser , res);
    });
})

// на будущее
// возвращает всех собеседников юзера, т.е. тех, 
// кому он отсылал сообщения и тех, кто отсылал ему
// Можно сделать комнаты в варианте с Ajax


router.get("/:id/chats", (req, res, next) => {
  UserService.findAllInterlocutor(req.params.id, (err, interlocutors) => {
    responseHandler(err, interlocutors , res);
  });
});


module.exports = router;