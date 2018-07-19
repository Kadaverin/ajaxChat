const router = require("express").Router();
const MessageService = require("../../services/message");
const responseHandler = require("../../helpers/responseHandler");


router.get("/last/:amount", (req, res, next) => {
  MessageService.getLastMessages(req.params.amount, (err, data) =>  responseHandler(err, data , res) )
}); 

router.post("/", (req, res, next) => {
  MessageService.createNewMessage( req.body, (err, data) => {
    responseHandler(err, data , res);
  });
}); 


router.get("/", (req, res, next) => {
  MessageService.all((err, data) =>  responseHandler(err, data , res) )
}); 

router.get("/:id", (req, res) => {
  MessageService.findOne(req.params.id, (err, user) => {
    responseHandler(err, user , res);
  });
})

router.put('/:id' , (req, res, next) => {
  MessageService.updateMessageById(req.params.id, req.body, (err, updatedMessage) => {
    responseHandler(err, updatedMessage, res);
  })
})

router.delete('/:id' , (req, res, next) => {
  MessageService.deleteMessageById(req.params.id, ( err ) => {
   if(!err){
      res.json({ message: 'Successfully deleted' });
   }else{
      res.status( 400 );
      res.end();
   }
  })
})

module.exports = router;