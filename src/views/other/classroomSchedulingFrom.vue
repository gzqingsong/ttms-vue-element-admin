/**
 * 保存或更新课室安排信息
 */
<template>
  <div class="new-app-container-fragment">
    <el-form
      ref="classroomSchedulingForm"
      :model="classroomSchedulingForm"
      :rules="rules"
      label-width="100px"
      class="demo-classroomSchedulingForm"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>课室安排信息表</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="使用人" prop="userId">
              <el-select
              clearable
              filterable
              style="width: 250px"
              v-model="classroomSchedulingForm.userId"
            >
              <el-option
                v-for="item in teacherData"
                :key="item.id"
                :label="item.fullName"
                :value="item.id"
              >
              </el-option>
            </el-select>

            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="开始使用时间" label-width="170px" prop="startTime">
              <el-date-picker
                v-model="classroomSchedulingForm.startTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="结束使用时间" label-width="170px" prop="endTime">
             <el-date-picker
                v-model="classroomSchedulingForm.endTime"
                type="datetime"
                placeholder="选择日期时间" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button type="primary" @click="submitClassroomSchedulingForm">保存</el-button>
          <el-button @click="backClassroomFn">取消</el-button>
        </el-row>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import { teacherList } from "../../api/user";
import {saveOrUpdateClassroomScheduling,getClassroomScheduling} from '../../api/other'

export default {
  name: "classroomSchedulingFormPage",
  props: {
    classroomId: {
      type: String,
      default: "",
    },
    id:{
      type: String,
      default: "",
    }
  },
  data() {
    return {
      classroomSchedulingForm: {
        id:'',
        userId: "",
        startTime: "",
        endTime:'',
        classroomId:''
      },
      teacherData:{},
      saveOrUpdateProjectInfoStatus: false,
      rules: {
        userId: [{ message: "请选择课室使用人", trigger: ['blur','change'], required: true }],
        startTime: [{ message: "请选择课室开始使用时间", trigger: ['blur','change'], required: true }],
        endTime: [{ message: "请选择课室结束使用时间", trigger: ['blur','change'], required: true }],
      },
    };
  },
  created() {
    if (this.classroomId !== undefined && this.classroomId !== "") {
        this.classroomSchedulingForm.classroomId = this.classroomId
    }
    if(this.id !== undefined && this.id!=='' && this.id!==null){
      this.showClassroomScheduling()
    }
    this.findTeacherList()
  },
  methods: {
    submitClassroomSchedulingForm() {

      this.$refs["classroomSchedulingForm"].validate((valid) => {
        if (valid) {
          saveOrUpdateClassroomScheduling(this.classroomSchedulingForm).then(
            (res) => {
              if (res.status === 200 && res.data.code === "0") {
                this.$message.success("保存成功");
                this.backClassroomFn();
              } else {
                const{data} = res.data
                this.$message({
                  message: res.data.message +": "+data.fullname+" "+data.startTime+"~"+data.endTime,
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

    // 查询教师信息
    findTeacherList() {
      const searchForm = {
        pageSize: 1000000,
        pageNum: 1,
      };
      teacherList(searchForm).then((res) => {
        if (res.status === 200 && res.data.code === "0" && res.data) {
          this.teacherData = res.data.data.list;
        }
      });
    },

    /** 课室时间安排详情 */
    showClassroomScheduling() {
      getClassroomScheduling(this.id).then((res) => {
        if (res.status === 200 && res.data.code === "0") {
          this.classroomSchedulingForm = res.data.data;
        }
      });
    },

    // 返回项目信息管理列表
    backClassroomFn() {
      this.$emit("closeClassroomSchedulingFromPage");
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
