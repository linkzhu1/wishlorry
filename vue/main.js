import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@fancyapps/fancybox";
import "@fancyapps/fancybox/dist/jquery.fancybox.css";
import App from "./app";
import api from "./api";
import "./css/font.css";

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.mixin({
  data: function() {
    return {
      api: api
    };
  }
});
new Vue({
  el: "#app",
  render: h => h(App)
});
