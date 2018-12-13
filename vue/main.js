import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./app";
import api from "./api";

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.mixin({
  data: function () {
    return {
      api: api
    };
  }
});
new Vue({
  el: "#app",
  render: h => h(App)
});