<template>
  <div class="background">
    <el-collapse accordion
                 v-model="active_names">
      <el-collapse-item title="活动规则"
                        name="1">
        <el-card>
          <p>年会集赞活动开始了！</p>
          <p>你想获得现金红包大礼吗？</p>
          <p>快来加入我们集赞活动吧！！</p>
          <p>进入活动前请仔细阅读规则哦~</p>
          <p>1、请上传一张你与“WISH”“W”（单词或字母）的合影。</p>
          <p>2、然后留下你想说的话。（字数不能少于20个字哦~）</p>
          <p>3、同时你也可以为你喜欢的照片点赞。</p>
          <p>4、点赞次数有限哦~每人仅有5次机会，点赞后不能取消。</p>
          <p>5、活动截止时间为：2019年1月18日17:00</p>
          <el-button @click.prevent="read"
                     type="text">已读，进入活动！</el-button>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="排名"
                        v-if="self && self.rule_read"
                        name="3">
        <div v-for="user in sortedList"
             :key="user.user_id">
          <span>{{user.user_id}}</span>
          <div style="float:right">
            <i class="el-icon-star-on">
              {{ user.num_star }}
            </i>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="点赞"
                        v-if="self && self.rule_read"
                        name="2">
        <el-row v-if="self">
          <user-card :user_id="self.user_id" />
        </el-row>
        <br/>
        <el-row>
          <el-input placeholder="感兴趣的用户"
                    v-model="re_str">
            <el-button @click="search"
                       slot="append"
                       class="el-icon-search">
            </el-button>
          </el-input>
        </el-row>
        <el-row :gutter="20"
                v-for="part in other_list_part"
                :key="part.id">
          <el-col :span="24/num_part"
                  v-for="user in part"
                  :key="user.user_id">
            <user-card :user_id='user.user_id'
                       class="card" />
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
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
</style>
<script>
import userCard from "./userCard";

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
      active_names: [],
      re_str: null
    };
  },
  computed: {
    sortedList: function() {
      var user_list = this.other_list.concat([this.self]);
      return _.sortBy(user_list, o => {
        return -o.num_star;
      });
    }
  },
  methods: {
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
    }
  },
  mounted: function() {
    var vm = this;
    vm.api.call_json("get-all", {}, user_list => {
      vm.self = _.filter(user_list, "self")[0];
      if (vm.self) {
        if (!vm.self.rule_read) vm.active_names = ["1"];
        else vm.active_names = ["2"];
      }
      vm.other_list = _.shuffle(_.filter(user_list, ["self", false]));
      vm.other_list_part = cut(vm.other_list, vm.num_part);
    });
  }
};
</script>
