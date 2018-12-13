const api = require("../util/api");
const COOKIES = require("../constants/cookie");
const session = require("../model/session");
const user = require("../model/user");
var handler = function(req, res) {
  var session_key = req.cookies.session_key;
  session
    .getUser(session_key)
    .then(user_id => {
      res.redirect("/");
    })
    .catch(msg => {
      console.log(msg);
      api.getUser(
        req.query.code,
        data => {
          user.create_if_not_exist(data.UserId).then(user => {
            session.create(
              data.UserId,
              resp => {
                console.log(`User ${data.UserId} Logged In!`);
                res.cookie(COOKIES.USER_ID, data.UserId);
                res.cookie(COOKIES.SESSION_KEY, resp._id.toString());
                res.redirect("/");
              },
              error => {
                console.log(error);
              }
            );
          });
        },
        error => {
          console.log(error);
          res.send("Fail");
        }
      );
    });
};
module.exports = handler;
