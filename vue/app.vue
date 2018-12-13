<template>
  <div>
    <el-row v-if="self">
      <user-card :user_id="self.user_id" />
    </el-row>
    <br/>
    <el-row :gutter="20"
            v-for="part in other_list_part"
            :key="part.id">
      <el-col :span="24/num_part"
              v-for="user in part"
              :key="user.user_id">
        <user-card :user_id='user.user_id' />
      </el-col>
    </el-row>
  </div>
</template>
<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
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
      other_list_part: []
    };
  },
  methods: {},
  mounted: function() {
    var vm = this;
    vm.api.call_json("get-all", {}, user_list => {
      vm.self = _.filter(user_list, "self")[0];
      vm.other_list = _.sortBy(_.filter(user_list, ["self", false]), o => {
        return -o.num_star;
      });
      vm.other_list_part = cut(vm.other_list, vm.num_part);
    });
  },
  updated: function() {},
  computed: {}
};
</script>
