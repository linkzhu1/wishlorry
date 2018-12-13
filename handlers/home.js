const Session = require("../model/session");
const User = require("../model/user");
const _ = require("lodash");
const handler = function(req, res) {
  res.redirect("/main.html");
};
module.exports = handler;
