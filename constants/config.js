const mongo_client = require("../model/mongo_client");
const config = {
  _ok: false,
  host: null,
  corp_id: null,
  agent_id: null,
  secret: null,
  access_token: null,
  init: function() {
    var c = this;
    return new Promise(function(resolve, reject) {
      if (c._ok) {
        resolve();
      } else {
        mongo_client.connect(() => {
          var _collection = mongo_client.getDB("wishlorry").collection("app");
          _collection
            .findOne({})
            .then(app => {
              if (!app) reject("App Config Not Found");
              else {
                c.corp_id = app.corp_id;
                c.agent_id = app.agent_id;
                c.secret = app.secret;
                c.access_token = "test";
                c.host = app.host;
                c._ok = true;
                resolve();
              }
            })
            .catch(mongo_error => {
              console.log(mongo_error.message);
              reject("Mongo Error Finding App");
            });
        });
      }
    });
  }
};
config.init();
module.exports = config;
