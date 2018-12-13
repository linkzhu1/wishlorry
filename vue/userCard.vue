<template>
    <el-card class="box-card">
        <div slot="header"
             v-if="user">
            <span>{{ user.user_id }}</span>
            <div style="float:right">
                <i v-if="user.self || user.in_star"
                   class="el-icon-star-on">
                    {{ user.num_star }}
                </i>
                <a v-else
                   href="#"
                   @click.prevent="star">
                    <i class="el-icon-plus">
                        点赞
                    </i>
                </a>
            </div>
        </div>
        <el-row v-if="user"
                type="flex"
                justify="center">
            <el-upload class="avatar-uploader"
                       action="api/upload-pic"
                       :show-file-list="false"
                       :on-success="successHook"
                       :disabled="!user.self">
                <img v-if="user.has_pic"
                     ref="image"
                     :src="`api/get-user-pic/${user.user_id}`"
                     class="image">
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
                    点击添加自我介绍
                </p>
            </a>
        </el-row>
        <el-row v-show="in_edit">
            <el-input type="textarea"
                      autosize
                      placeholder="输入自我介绍"
                      v-model="user.des">
            </el-input>
        </el-row>
        <el-row v-show="in_edit">
            <el-button @click.prevent="submit"
                       type="success"
                       size="mini"
                       icon="el-icon-check"
                       circle></el-button>
        </el-row>
        <el-row v-if="user && !user.self">
            <p>
                {{ user.des }}
            </p>
        </el-row>
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
  width: 100%;
  display: block;
}
</style>
<script>
export default {
  props: ["user_id"],
  data() {
    return {
      user: {},
      reload: 0,
      in_edit: false
    };
  },
  methods: {
    getData: function() {
      var vm = this;
      if (!vm.user_id) return;
      vm.api.call_json(`get-user/${vm.user_id}`, {}, user => {
        vm.user = user;
      });
    },
    successHook: function(resp, file, file_list) {
      this.getData();
      this.reload += 1;
      this.$refs.image.src = `api/get-user-pic/${this.user.user_id}?v=${
        this.reload
      }`;
    },
    submit: function() {
      var vm = this;
      vm.api.call_json(
        "update-des",
        {
          des: vm.user.des
        },
        resp => {
          vm.getData();
          vm.in_edit = false;
        }
      );
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
        }
      );
    }
  },
  mounted: function() {
    this.getData();
  }
};
</script>
