const db_name = "wishlorry";
const col_name = "session";
const mongo_client = require("./mongo_client");
mongo_client.connect();
const mongo = require("mongodb");
const model = {
  _get_collection: function() {
    var db = mongo_client.getDB(db_name);
    if (db) return db.collection(col_name);
  },
  create: function(user_id, callback, errorCallback) {
    var m = this;
    var collection = m._get_collection();
    if (collection) {
      return collection.insertOne({ user_id: user_id }, (err, result) => {
        if (err) errorCallback(err);
        else callback(result.ops[0]);
      });
    }
  },
  getUser: function(session_key) {
    var m = this;
    var collection = m._get_collection();
    return new Promise(function(resolve, reject) {
      if (mongo.ObjectId.isValid(session_key)) {
        let s_id = mongo.ObjectID(session_key);
        collection
          .findOne({
            _id: s_id
          })
          .then(data => {
            if (!data) reject("Session Not Found");
            else resolve(data.user_id);
          })
          .catch(error => {
            reject(`Session Get User Mongo Error: ${error.message}`);
          });
      } else {
        reject(`Invalid session key ${session_key}`);
      }
    });
  }
};
module.exports = model;
