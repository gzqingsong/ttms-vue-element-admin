/**
 * 保存或更新人员信息
 */
<template>
  <div class="new-app-container-fragment">
    <el-form
      ref="classForm"
      :model="classForm"
      :rules="rules"
      label-width="100px"
      class="demo-classForm"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>班级信息表</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="班级名" prop="className">
              <el-input v-model="classForm.className" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="人数" prop="peopleNumber">
              <el-input v-model="classForm.peopleNumber" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button type="primary" @click="submitClassForm">保存</el-button>
          <el-button @click="backClassFn">取消</el-button>
        </el-row>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import {saveOrUpdateClass,getClass} from '../../api/other'

export default {
  name: "classFormPage",
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      classForm: {
        id: "",
        className: "",
        peopleNumber: "",
        
      },
      saveOrUpdateProjectInfoStatus: false,
      projectInfo: null,
      rules: {
        className: [{ message: "请输入班级名", trigger: "blur", required: true }],
        peopleNumber: [{ message: "请输入班级人数", trigger: "blur", required: true }],
      },
    };
  },
  created() {
    if (this.id !== undefined && this.id !== "") {
      console.log("开始执行请求");
      this.showUserInfo()
    }
  },
  methods: {
    submitClassForm() {
      this.$refs["classForm"].validate((valid) => {
        if (valid) {
          saveOrUpdateClass(this.classForm).then(
            (res) => {
              if (res.status === 200 && res.data.code === "0") {
                this.$message.success("保存成功");
                this.backClassFn();
              } else {
                this.$message({
                  message: res.data.message,
                  type: "error",
                });
              }
            },
            (err) => {
              this.$message.error("保存失败，请重试");
            }
          );
        }
      });
    },

    /** 人员详情 */
    showUserInfo() {
      getClass(this.id).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.code === "0") {
          this.classForm = res.data.data;
        }
      });
    },

    // 返回项目信息管理列表
    backClassFn() {
      this.$emit("closeUserFrom");
    },
  },
};
</script>
<style lang="scss" scoped>
.new-app-container-fragment {
  .form-title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 15px;
  }
}
.total {
  text-align: right;
  margin: 10px 0;
}
.tip {
  text-align: right;
  color: red;
  font-size: 14px;
}
.box-card {
  margin-bottom: 15px;
}
</style>
