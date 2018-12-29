import axios from "axios";
import { Message } from "element-ui";
const _axios_call = function(config, callback, errorCallback, loader) {
  axios(config)
    .then(function(resp) {
      if (loader) loader.hide();
      if (callback) callback(resp.data);
    })
    .catch(function(error) {
      if (loader) loader.hide();
      if (error.response && _.isObject(error.response.data)) {
        if (errorCallback) {
          errorCallback(error.response.data);
        } else {
          Message.error(error.response.data.msg);
        }
      } else {
        console.log(error);
      }
    });
};
export default {
  call_json: function(method, params, callback, errorCallback, loader) {
    if (loader) loader.show();
    var data = _.pickBy(params, e => {
      return !_.isNil(e);
    });
    var config = {
      data: data,
      method: "post",
      url: "api/" + method
    };
    _axios_call(config, callback, errorCallback, loader);
  }
};
