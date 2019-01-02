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
                 :disabled="!user.self || user.num_star!=0">
        <a v-show="user.has_pic"
           :href="`api/get-user-pic/${user.user_id}?v=${reload}`"
           class="box">
          <img :src="`api/get-user-pic/${user.user_id}?v=${reload}`"
               class="image">
        </a>
        <i v-show="!user.has_pic"
           class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-row>
    <el-row v-if="user && user.self"
            type="flex"
            justify="center">
      <a v-show="!in_edit"
         href="#"
         @click.prevent="in_edit=true;des_input = user.des;">
        <div class="des-container"
             v-if="user.des">
          {{ user.des }}
        </div>
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
      <div class="des-container">
        {{ user.des || '这人很懒，没留下什么话～' }}
      </div>
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
  color: #e6a23c;
}
.star-off {
  font-size: 15px;
}
.self-star {
  font-size: 18px;
  color: #e6a23c;
}
.des-container {
  width: 100%;
  height: auto;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
  overflow: auto;
}
</style>
<script>
import { Message } from "element-ui";
export default {
  props: ["user_id", "auto_refresh"],
  data() {
    return {
      user: {},
      reload: 0,
      in_edit: false,
      des_input: null,
      show_modal: false,
      timer: null
    };
  },
  computed: {
    box: function() {
      return $(this.$el).find(".box");
    },
    starClass: function() {
      var vm = this;
      if (vm.user.in_star)
        return "el-icon-star-on star-on font-effect-shadow-multiple";
      else if (vm.user.self) return "el-icon-star-on self-star";
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
        vm.reload++;
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
          Message.success("点赞的都是真爱~谢谢你！");
        }
      );
    },
    refresh: function() {
      if (!this.auto_refresh) return;
      this.getData();
    }
  },
  mounted: function() {
    var func = _.bind(this.refresh, this);
    var vm = this;
    this.getData();
    this.box.fancybox({
      beforeShow: function(instance, current) {
        current.opts.caption = vm.user.des || "这人很懒，没留下什么话～";
      },
      opts: {}
    });
    this.timer = setInterval(func, 5000);
  }
};
</script>
