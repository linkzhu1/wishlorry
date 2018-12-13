const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
module.exports = {
  _client: null,
  connect: function(callback) {
    if (this._client) return;
    var instance = this;
    MongoClient.connect(
      url,
      (err, client) => {
        if (err) {
          console.log(`Connect to Mongo Error: ${err}`);
          throw err;
        }
        instance._client = client;
        console.log("Mongo Connected..");
        if (callback) callback();
      }
    );
  },
  getDB: function(db_name) {
    var client = this;
    if (client._client) return client._client.db(db_name);
  }
};
