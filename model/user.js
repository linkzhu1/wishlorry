const db_name = "wishlorry";
const col_name = "user";
const mongo_client = require("./mongo_client");
mongo_client.connect();
const mongo = require("mongodb");
const model = {
  _get_collection: function() {
    var db = mongo_client.getDB(db_name);
    if (db) return db.collection(col_name);
  },
  by_id: function(user_id) {
    var collection = this._get_collection();
    return collection.findOne({
      user_id: user_id
    });
  },
  create_if_not_exist: function(user_id) {
    var m = this;
    var collection = m._get_collection();
    return new Promise(function(resolve, reject) {
      m.by_id(user_id)
        .then(user => {
          if (!user) {
            collection
              .insertOne({
                user_id: user_id
              })
              .then(results => {
                let user = results.ops[0];
                console.log(`User ${user.user_id} created`);
                resolve(user);
              })
              .catch(e => {
                reject(e.message);
              });
          } else resolve(user);
        })
        .catch(e => {
          reject(e.message);
        });
    });
  },
  get_all: function(user_id) {
    var m = this;
    var collection = m._get_collection();
    return collection
      .find({
        $or: [{ user_pic: { $ne: "", $exists: true } }, { user_id: user_id }]
      })
      .toArray();
  },
  get_user: function(user_id) {
    collection = this._get_collection();
    return new Promise(function(resolve, reject) {
      collection
        .findOne({ user_id: user_id })
        .then(user => {
          if (!user) reject("User Not Found");
          resolve(user);
        })
        .catch(mongo_error => {
          reject(`Mongo Error ${mongo_error.message}`);
        });
    });
  },
  update_pic: function(user_id, pic_data) {
    collection = this._get_collection();
    return new Promise(function(resolve, reject) {
      collection
        .updateOne({ user_id: user_id }, { $set: { user_pic: pic_data } })
        .then(result => {
          resolve(result);
        })
        .catch(mongo_error => {
          reject(`Mongo Error ${mongo_error.message}`);
        });
    });
  },
  update_des: function(user_id, des) {
    collection = this._get_collection();
    return new Promise(function(resolve, reject) {
      collection
        .updateOne({ user_id: user_id }, { $set: { des: des } })
        .then(result => {
          resolve(result);
        })
        .catch(mongo_error => {
          reject(`Mongo Error ${mongo_error.message}`);
        });
    });
  },
  star_user: function(self_user_id, user_id) {
    collection = this._get_collection();
    return new Promise(function(resolve, reject) {
      collection
        .updateOne({ user_id: user_id }, { $addToSet: { star: self_user_id } })
        .then(result => {
          resolve(result);
        })
        .catch(mongo_error => {
          reject(`Mongo Error ${mongo_error.message}`);
        });
    });
  }
};
module.exports = model;
