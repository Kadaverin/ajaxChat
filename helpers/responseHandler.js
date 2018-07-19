function responseHandler(err, data , res, badStatus = '400'){
  if (!err) {
      res.data = data;
      res.json(res.data);
    } else {
      console.log('________________')
      console.log(err)
      res.status( badStatus );
      res.end();
    }
}

module.exports = responseHandler;