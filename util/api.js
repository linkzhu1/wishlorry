const base_url = "https://qyapi.weixin.qq.com/cgi-bin/";
const config = require("../constants/config");
const axios = require("axios");
const errors = {
  SUCCESS: 0,
  ACCESS_TOKEN_INVALID: 40014,
  ACCESS_TOKEN_EXPIRED: 42001
};

const api = {
  _access_token: null,
  _corp_id: null,
  _secret: null,
  _default_exception_handler: function(resp, errorCallback, next) {
    var api = this;
    if (
      resp.data.errcode == errors.ACCESS_TOKEN_INVALID ||
      resp.data.errcode == errors.ACCESS_TOKEN_EXPIRED
    ) {
      axios
        .get(`${base_url}/gettoken`, {
          params: {
            corpid: api._corp_id,
            corpsecret: api._secret
          }
        })
        .then(function(r) {
          if (r.data.errcode == errors.SUCCESS) {
            api._access_token = r.data.access_token;
            if (next) next();
          } else {
            errorCallback(r.data);
          }
        });
    } else {
      errorCallback(resp.data);
    }
  },
  getUser: function(code, callback, errorCallback) {
    var api = this;
    axios
      .get(`${base_url}/user/getuserinfo`, {
        params: {
          access_token: api._access_token,
          code: code
        }
      })
      .then(function(resp) {
        if (resp.data.errcode != errors.SUCCESS) {
          api._default_exception_handler(resp, errorCallback, () => {
            api.getUser(code, callback, errorCallback);
          });
        } else {
          callback(resp.data);
        }
      });
  }
};
config.init().then(() => {
  api._access_token = config.access_token;
  api._corp_id = config.corp_id;
  api._secret = config.secret;
});
module.exports = api;
