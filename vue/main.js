import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@fancyapps/fancybox";
import "@fancyapps/fancybox/dist/jquery.fancybox.css";
import App from "./app";
import api from "./api";
import "./css/font.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSnowflake,
  faAngleDoubleRight,
  faListOl,
  faBook,
  faHeart,
  faRedo
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { dom } from "@fortawesome/fontawesome-svg-core";
library.add(
  faSnowflake,
  faAngleDoubleRight,
  faListOl,
  faBook,
  faHeart,
  farHeart,
  faRedo
);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.mixin({
  data: function() {
    return {
      api: api
    };
  }
});
dom.watch();
new Vue({
  el: "#app",
  render: h => h(App)
});
