
class Repository{
  getAll(callback) {
    this.model.find().exec(callback);
  }

  getById(id, callback) {
    let query = this.model.findOne({
        _id: id
    });
    query.exec(callback);   
  }

  updateById(id , params, callback){
    this.model.findByIdAndUpdate(id, params).exec(callback)
  }

  create(entity , callback){
    this.model.create(entity , callback)
  }

  deleteById(id, callback){
    this.model.remove( {'_id': id} ).exec(callback);
  }
}

module.exports = Repository;