<template>
  <div class="">
    <el-container>
      <el-header class="header">
        <div>
          <h3 class="header-title">"筑梦想·wish年”</h3>
        </div>
      </el-header>
      <el-main class="main">
        <p>2019新春年会集赞活动开始了！</p>
        <p>想获得现金红包大奖吗？</p>
        <p>按”赞“数排名年会现场领取红包大奖，超大红包等你来拿！！</p>
        <p>快来加入年会集赞活动吧！！
          <i class="fas fa-snowflake fa-spin"
             style="color:#409eff;"></i>
        </p>
        <el-collapse accordion
                     v-model="active_names">
          <el-collapse-item name="1">
            <template slot="title">
              <i class="fas fa-book fa-pull-left"></i>规则阅读
            </template>
            <h4>活动规则</h4>
            <p>1、请上传一张你与“WISH”或“W”（单词或字母）的合影。</p>
            <p>2、并留下你想说的话。（字数不能少于20个字哦~）</p>
            <p>即可参与本次活动，照片被点赞后将不得修改替换。快快上传照片并为自己拉票吧~</p>
            <h4>点赞规则</h4>
            <p>参与活动的同时也可为喜欢的照片点赞！</p>
            <p>点赞次数有限哦~每人仅有5次点赞机会，点赞后不能取消。</p>
            <h4 style="color:#ff4949;">活动截止时间为：2019年1月18日17:00</h4>
            <el-button @click.prevent="read"
                       type="text"
                       class="btn-read">
              <i class="fas fa-angle-double-right fa-pull-left"></i>已读，进入活动！
            </el-button>
          </el-collapse-item>
          <el-collapse-item v-if="self && self.rule_read"
                            name="3">
            <template slot="title">
              <i class="fas fa-list-ol fa-pull-left"></i>排名
            </template>
            <div v-for="user in sorted_list"
                 :key="user.user_id"
                 :class="rankClass(user)">
              <span>{{user.user_id}}
              </span>
              <div style="float:right">
                <i class="fas fa-heart rank-star">
                </i>{{ user.num_star }}
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item v-if="self && self.rule_read"
                            name="2">
            <template slot="title">
              <i class="far fa-heart fa-pull-left"></i>点赞
            </template>
            <el-row v-if="self">
              <user-card :user_id="self.user_id"
                         :auto_refresh="auto_refresh"
                         :allow_reset="self.can_reset" />
            </el-row>
            <br/>
            <el-row>
              <el-input placeholder="感兴趣的用户"
                        v-model="re_str"
                        class="input-search">
                <el-button @click="search"
                           slot="append"
                           class="el-icon-search">
                </el-button>
              </el-input>
            </el-row>
            <!-- <el-row>
          <el-checkbox v-model="auto_refresh">
            自动刷新
          </el-checkbox>
        </el-row> -->
            <el-row :gutter="20"
                    v-for="part in other_list_part"
                    :key="part.id">
              <el-col :span="24/num_part"
                      v-for="user in part"
                      :key="user.user_id">
                <user-card :user_id='user.user_id'
                           :auto_refresh="auto_refresh"
                           :allow_reset="self.can_reset"
                           class="card" />
              </el-col>
            </el-row>
            <!-- <el-carousel>
          <el-carousel-item v-for="user in other_list"
                            :key="user.user_id">
            <user-card :user_id='user.user_id'
                       :auto_refresh="auto_refresh"
                       class="" />
          </el-carousel-item>
        </el-carousel> -->
          </el-collapse-item>
        </el-collapse>
      </el-main>
      <el-footer class="footer">
        <span>Designed by Wish</span>
      </el-footer>
    </el-container>
  </div>
</template>
<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.card {
  height: 300px;
}
.header-title {
  color: #409eff;
  text-align: center;
}
.header {
  font-family: "ZCOOL KuaiLe", cursive;
}
.main {
  font-family: "ZCOOL KuaiLe", cursive;
}
.footer {
  font-family: "Lobster";
  text-align: center;
}
.rank-star {
  color: #f56c6c;
  margin-right: 5px;
}
.rank-item {
  font-size: 15px;
}
.rank-highlight {
  background-color: #ebeef5;
}
.btn-read {
  font-family: "ZCOOL KuaiLe", cursive;
}
.input-search {
  font-family: "ZCOOL KuaiLe", cursive;
}
</style>
<script>
import userCard from "./userCard";
import headerlogo from "./images/headerlogo.png";
const cut = function(arr, num) {
  var result = [];
  var tmp = [];
  var cnt = 0;
  _.each(arr, e => {
    tmp.push(e);
    cnt += 1;
    if (cnt == num) {
      result.push(tmp);
      tmp = [];
      cnt = 0;
    }
  });
  if (cnt) result.push(tmp);
  return result;
};
export default {
  components: {
    userCard
  },
  data() {
    return {
      num_part: 2,
      self: null,
      other_list: [],
      other_list_part: [],
      sorted_list: [],
      active_names: [],
      re_str: null,
      auto_refresh: true,
      timer: null,
      headerlogo: headerlogo
    };
  },
  computed: {},
  methods: {
    rankClass: function(user) {
      if (!user.in_star) return "rank-item";
      else return "rank-item rank-highlight";
    },
    read: function() {
      var vm = this;
      vm.api.call_json("read-rule", {}, resp => {
        vm.self.rule_read = true;
        vm.active_names = ["2"];
      });
    },
    search: function() {
      var vm = this;
      var re = RegExp(`.*${(vm.re_str || "").toLowerCase()}.*`);
      vm.other_list_part = cut(
        _.filter(vm.other_list, user => {
          var name = user.user_id.toLowerCase();
          return re.test(name);
        }),
        vm.num_part
      );
    },
    getData: function() {
      var vm = this;
      vm.api.call_json("get-all", {}, user_list => {
        vm.sorted_list = _.sortBy(user_list, o => {
          return -o.num_star;
        });
        vm.self = _.filter(user_list, "self")[0];
        if (vm.self && !vm.active_names.length) {
          if (!vm.self.rule_read) vm.active_names = ["1"];
          else vm.active_names = ["2"];
        }
        if (
          !vm.other_list.length ||
          vm.other_list.length + 1 < user_list.length
        ) {
          if (!vm.other_list.length)
            vm.other_list = _.shuffle(_.filter(user_list, ["self", false]));
          else {
            var now_ids = new Set(_.map(user_list, "user_id"));
            _.each(vm.other_list, user => {
              now_ids.delete(user.user_id);
            });
            _.each(user_list, user => {
              if (now_ids.has(user.user_id) && !user.self) {
                vm.other_list.push(user);
              }
            });
          }
          vm.other_list_part = cut(vm.other_list, vm.num_part);
        }
      });
    }
  },
  mounted: function() {
    this.getData();
    var func = _.bind(this.getData, this);
    this.timer = setInterval(func, 10000);
  }
};
</script>
