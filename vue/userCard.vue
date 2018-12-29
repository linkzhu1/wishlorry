<template>
  <el-card class="box-card">
    <div slot="header"
         v-if="user">
      <span>{{ user.user_id }}</span>
      <span>
        <div style="float:right">
          <i :class="starClass"
             @click.prevent="beforeStar">
            {{ user.num_star }}
          </i>
        </div>
      </span>
    </div>
    <el-row v-if="user"
            type="flex"
            justify="center">
      <el-upload class="avatar-uploader"
                 action="api/upload-pic"
                 :show-file-list="false"
                 :on-success="successHook"
                 :disabled="!user.self">
        <a v-if="user.has_pic"
           :href="`api/get-user-pic/${user.user_id}?v=${reload}`"
           data-fancybox
           :data-caption="user.des">
          <img :src="`api/get-user-pic/${user.user_id}?v=${reload}`"
               class="image">
        </a>
        <i v-else
           class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-row>
    <el-row v-if="user && user.self"
            type="flex"
            justify="center">
      <a v-show="!in_edit"
         href="#"
         @click.prevent="in_edit=true">
        <p v-if="user.des">
          {{ user.des }}
        </p>
        <p v-else>
          点击添加你想说的话
        </p>
      </a>
    </el-row>
    <el-row v-show="in_edit">
      <el-input type="textarea"
                autosize
                placeholder="在这儿留下你想说的话哦～"
                v-model="des_input">
      </el-input>
    </el-row>
    <el-row v-show="in_edit">
      <el-button @click.prevent="submit"
                 type="success"
                 size="mini"
                 icon="el-icon-check"
                 circle></el-button>
      <el-button @click.prevent="cancel"
                 type="danger"
                 size="mini"
                 icon="el-icon-close"
                 circle></el-button>
    </el-row>
    <el-row v-if="user && !user.self">
      <p>
        {{ user.des }}
      </p>
    </el-row>
    <el-dialog v-if="user"
               title="点赞"
               :visible.sync="show_modal"
               width="100%">
      <span>
        确定要给{{ user.user_id }} 点赞吗？点赞次数有限哦~每人仅有5次机会，点赞后不能取消。
      </span>
      <span slot="footer">
        <el-button @click="show_modal = false">取消</el-button>
        <el-button type="success"
                   @click="star">点赞</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<style>
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.image {
  max-width: 100%;
  height: 100px;
  display: block;
}
.icon-plus {
  font-size: 10px;
}
.star-on {
  font-size: 18px;
}
.star-off {
  font-size: 15px;
}
</style>
<script>
export default {
  props: ["user_id"],
  data() {
    return {
      user: {},
      reload: 0,
      in_edit: false,
      des_input: null,
      show_modal: false
    };
  },
  computed: {
    starClass: function() {
      var vm = this;
      if (vm.user.self || vm.user.in_star)
        return "el-icon-star-on star-on font-effect-fire-animation";
      else return "el-icon-star-off star-off";
    },
    plusClass: function() {
      return "el-icon-plus icon-plus";
    }
  },
  methods: {
    getData: function() {
      var vm = this;
      if (!vm.user_id) return;
      vm.api.call_json(`get-user/${vm.user_id}`, {}, user => {
        vm.user = user;
        vm.des_input = user.des;
      });
    },
    successHook: function(resp, file, file_list) {
      this.getData();
      this.reload += 1;
    },
    cancel: function() {
      var vm = this;
      vm.in_edit = false;
      vm.des_input = vm.user.des;
    },
    submit: function() {
      var vm = this;
      vm.api.call_json(
        "update-des",
        {
          des: vm.des_input
        },
        resp => {
          vm.getData();
          vm.in_edit = false;
        }
      );
    },
    beforeStar: function() {
      if (this.user.self || this.user.in_star) return;
      this.show_modal = true;
    },
    star: function() {
      var vm = this;
      vm.api.call_json(
        "star-user",
        {
          user_id: vm.user.user_id
        },
        resp => {
          vm.getData();
          vm.show_modal = false;
        }
      );
    }
  },
  mounted: function() {
    this.getData();
  }
};
</script>
