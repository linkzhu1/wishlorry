const express = require("express");
const app = express();
const port = 3000;
const login_handler = require("./handlers/login");
const home_handler = require("./handlers/home");
const api_handlers = require("./api");
const mongo_client = require("./model/mongo_client");
const cookie_parser = require("cookie-parser");
const Session = require("./model/session");
const multer = require("multer");
const body_parser = require("body-parser");
const config = require("./constants/config");

const check_login = function(req, res, next) {
  Session.getUser(req.cookies.session_key)
    .then(user_id => {
      req.user_id = user_id;
      next();
    })
    .catch(msg => {
      console.log("Login Needed");
      if (config.client_side) {
        res.redirect(
          `https://open.weixin.qq.com/connect/oauth2/authorize?` +
            `appid=${config.corp_id}` +
            `&redirect_uri=${config.host}/login` +
            `&response_type=code&scope=snsapi_base#wechat_redirect`
        );
      } else {
        res.redirect(
          "https://open.work.weixin.qq.com/wwopen/sso/qrConnect?" +
            `appid=${config.corp_id}` +
            `&agentid=${config.agent_id}` +
            `&redirect_uri=${config.host}/login`
        );
      }
    });
};
app.use(function(req, res, next) {
  console.log(`Request from IP:${req.headers["x-forwarded-for"] || req.ip}`);
  next();
});
app.use(express.static("./vue/dist"));
app.use(cookie_parser());
app.use(body_parser.json());
app.get("/status", function (req, res) {
  res.send("OK");
});
//get handlers
app.get("/login", login_handler);
app.use(check_login);
app.get("/", home_handler);

//post handler
app.post("/api/get-all", api_handlers.get_all_handler);
app.post("/api/get-user/:user_id", api_handlers.get_user_handler);

const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 5
  }
});
app.post(
  "/api/upload-pic",
  upload.single("file"),
  api_handlers.upload_pic_handler
);
app.get("/api/get-user-pic/:user_id", api_handlers.get_pic_handler);
app.post("/api/update-des", api_handlers.update_des_handler);
app.post("/api/star-user", api_handlers.star_user_handler);

config.init().then(() => {
  app.listen(port, () => console.log(`WishLorry Server Start on port ${port}`));
});
