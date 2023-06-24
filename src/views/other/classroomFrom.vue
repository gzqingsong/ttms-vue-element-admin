/**
 * 保存或更新人员信息
 */
<template>
  <div class="new-app-container-fragment">
    <el-form
      ref="classroomForm"
      :model="classroomForm"
      :rules="rules"
      label-width="100px"
      class="demo-classroomForm"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>课室信息表</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="课室名" prop="classroomName">
              <el-input v-model="classroomForm.classroomName" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="位置" prop="location">
              <el-input v-model="classroomForm.location" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="容量(人)" prop="capacity">
              <el-input v-model="classroomForm.capacity" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="使用时间" prop="serviceTime">
              <el-input v-model="classroomForm.serviceTime" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="使用人" prop="username">
              <el-input v-model="classroomForm.username" clearable />
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row>
          <el-button type="primary" @click="submitClassroomForm">保存</el-button>
          <el-button @click="backClassroomFn">取消</el-button>
        </el-row>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import {saveOrUpdateClassroom,getClassroomById} from '../../api/other'

export default {
  name: "classroomFormPage",
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      classroomForm: {
        id: "",
        classroomName: "",
      },
      saveOrUpdateProjectInfoStatus: false,
      rules: {
        // className: [{ message: "请输入班级名", trigger: "blur", required: true }],
        // peopleNumber: [{ message: "请输入班级人数", trigger: "blur", required: true }],
      },
    };
  },
  created() {
    if (this.id !== undefined && this.id !== "") {
      console.log("开始执行请求");
      this.showClassroomInfo()
    }
  },
  methods: {
    submitClassroomForm() {
      this.$refs["classroomForm"].validate((valid) => {
        if (valid) {
          saveOrUpdateClassroom(this.classroomForm).then(
            (res) => {
              if (res.status === 200 && res.data.code === "0") {
                this.$message.success("保存成功");
                this.backClassroomFn();
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
    showClassroomInfo() {
      getClassroomById(this.id).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.code === "0") {
          this.classroomForm = res.data.data;
        }
      });
    },

    // 返回项目信息管理列表
    backClassroomFn() {
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
