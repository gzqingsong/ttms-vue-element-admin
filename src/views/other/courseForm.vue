/**
 * 保存或更新人员信息
 */
<template>
  <div class="new-app-container-fragment">
    <el-form
      ref="courseForm"
      :model="courseForm"
      :rules="rules"
      label-width="100px"
      class="demo-courseForm"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>课程信息表</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="课程名" prop="courseName">
              <el-input v-model="courseForm.courseName" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="学时" prop="totalClassTime">
              <el-input v-model="courseForm.totalClassTime" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="上课时长(分钟)" label-width="150px" prop="duration">
              <el-input v-model="courseForm.duration" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="背景颜色" prop="backgroundColor">
              <el-color-picker v-model="courseForm.backgroundColor" >
              </el-color-picker>
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
import { saveOrUpdateCourse, getCourse } from "../../api/other";

export default {
  name: "courseFormPage",
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      courseForm: {
        id: "",
        courseName: "",
        totalClassTime: "",
      },
      saveOrUpdateProjectInfoStatus: false,
      projectInfo: null,
      rules: {
        courseName: [
          { message: "请输入课程名", trigger: "blur", required: true },
        ],
        totalClassTime: [
          { message: "请输入课程学时", trigger: "blur", required: true },
        ],
      },
    };
  },
  created() {
    if (this.id !== undefined && this.id !== "") {
      console.log("开始执行请求");
      this.showCourseInfo();
    }
  },
  methods: {
    submitClassForm() {
      this.$refs["courseForm"].validate((valid) => {
        if (valid) {
          saveOrUpdateCourse(this.courseForm).then(
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
    showCourseInfo() {
      getCourse(this.id).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.code === "0") {
          this.courseForm = res.data.data;
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
