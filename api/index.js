const User = require("../model/user");
const Session = require("../model/session");
const _ = require("lodash");
const map_f = function(user, self_user_id) {
  var result = _.assign({}, user);
  result.self = result.user_id == self_user_id;
  if (!_.isArray(result.star)) {
    result.num_star = 0;
    result.in_star = false;
  } else {
    result.num_star = result.star.length;
    result.in_star = result.star.includes(self_user_id);
  }
  return {
    user_id: result.user_id,
    self: result.self,
    has_pic: !_.isEmpty(result.user_pic),
    num_star: result.num_star,
    in_star: result.in_star,
    des: result.des
  };
};
const apis = {
  get_all_handler: function(req, res) {
    var user_id = req.user_id;
    User.get_all(user_id).then(users => {
      var user_data_list = [];
      _.each(users, user => {
        user_data_list.push({
          user_id: user.user_id,
          self: user.user_id == user_id,
          num_star: (user.num_star && user.num_star.length) || 0
        });
      });
      res.json(user_data_list);
    });
  },
  get_user_handler: function(req, res) {
    var self_user_id = req.user_id;
    var user_id = req.params.user_id;
    User.get_user(user_id)
      .then(user => {
        user_data = map_f(user, self_user_id);
        res.json(user_data);
      })
      .catch(message => {
        console.log(message);
        res.send(message);
      });
  },
  upload_pic_handler: function(req, res) {
    console.log(`Upload File Type: ${req.file.mimetype}`);
    console.log(`Upload File Size: ${req.file.size / 1024 / 1024}M`);
    var user_id = req.user_id;
    User.update_pic(user_id, req.file.buffer)
      .then(mongo_result => {
        res.json({});
      })
      .catch(msg => {
        console.log(msg);
        res.send("Upload Pic Failed");
      });
  },
  get_pic_handler: function(req, res) {
    var user_id = req.params.user_id;
    User.get_user(user_id)
      .then(user => {
        res.send(user.user_pic.buffer);
      })
      .catch(msg => {
        console.log(msg);
        res.send("User Not Found");
      });
  },
  update_des_handler: function(req, res) {
    var user_id = req.user_id;
    var des = req.body.des;
    if (!des) res.json({});
    else {
      User.update_des(user_id, des)
        .then(mongo_result => {
          res.json({});
        })
        .catch(msg => {
          console.log(msg);
          res.send("Update Des Failed");
        });
    }
  },
  star_user_handler: function(req, res) {
    var self_user_id = req.user_id;
    var user_id = req.body.user_id;
    if (!user_id || user_id == self_user_id) {
      res.end();
    } else {
      User.star_user(self_user_id, user_id)
        .then(mongo_result => {
          res.json({});
        })
        .catch(msg => {
          console.log(msg);
          res.send("Update star failed");
        });
    }
  }
};
module.exports = apis;
