/**
 * 保存或更新教师信息
 */
<template>
  <div class="new-app-container-fragment">
    <el-form
      ref="studentFrom"
      :model="studentFrom"
      :rules="rules"
      label-width="100px"
      class="demo-studentFrom"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>学员信息表</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="姓名" prop="fullName">
              <el-input v-model="studentFrom.fullName" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别" prop="gender">
              <el-select
                v-model="studentFrom.gender"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in genderOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="账号" prop="username">
              <el-input v-model="studentFrom.username" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="密码" prop="password">
              <el-input v-model="studentFrom.password" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="生日" prop="birthDate">
              <el-date-picker
                v-model="studentFrom.birthDate"
                value-format="yyyy-MM-dd"
                type="date"
                clearable
                style="width: 150px"
                placeholder="请选择"
                @change="setAge(studentFrom.birthDate)"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年龄" prop="age">
              <el-input v-model="studentFrom.age" disabled clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系方式" prop="contactWay">
              <el-input v-model="studentFrom.contactWay" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="班级" prop="classId">
              <el-select
                v-model="studentFrom.classId"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in classList"
                  :key="item.className"
                  :label="item.className"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年级" prop="grade">
              <el-input v-model="studentFrom.grade" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="学校" prop="school">
              <el-input v-model="studentFrom.school" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="已学课时" prop="usedClassHours">
              <el-input v-model="studentFrom.usedClassHours" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="剩余课时" prop="remainClassHours">
              <el-input
                v-model="studentFrom.remainClassHours"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button type="primary" @click="submitTeacherForm">保存</el-button>
          <el-button @click="backUserInfo">取消</el-button>
        </el-row>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import {classList} from '../../api/other'
import {saveOrUpdateUser,getStudentInfo} from '../../api/user'

export default {
  name: "studentFormPage",
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      studentFrom: {
        id: "",
        classId:"",
        fullName: "",
        username: "",
        password: "",
        birthDate: "",
        gender: "",
        age: "",
        contactWay: "",
        roleName: 2,
      },
      genderOptions: [
        {
          label: "男",
          value: 1,
        },
        {
          label: "女",
          value: 0,
        },
      ],
      saveOrUpdateProjectInfoStatus: false,
      classList:[],
      projectInfo: null,
      rules: {
        fullName: [{ message: "请输入姓名", trigger: "blur", required: true }],
        gender: [
          {
            message: "请选择性别",
            trigger: ["blur", "change"],
            required: true,
          },
        ],
        username: [{ message: "请输入账号", trigger: "blur", required: true }],
        password: [{ message: "请输入密码", trigger: "blur", required: true }],
        birthDate: [
          {
            message: "请选择生日",
            trigger: ["blur", "change"],
            required: true,
          },
        ],
        age: [{ message: "请输入年龄", trigger: "blur", required: true }],
        contactWay: [
          { message: "请输入联系方式", trigger: "blur", required: true },
        ],
        roleName: [{ message: "请选择角色", trigger: "blur", required: true }],
      },
    };
  },
  created() {
    this.findClassList()
    if (this.id !== undefined && this.id !== "") {
      this.showStudentInfo()
      
    }
  },
  methods: {
    submitTeacherForm() {
      this.$refs["studentFrom"].validate((valid) => {
        if (valid) {
          console.log(this.studentFrom);
          saveOrUpdateUser(this.studentFrom).then(
            (res) => {
              if (res.status === 200 && res.data.code === "0") {
                this.$message.success("保存成功");
                this.backUserInfo();
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
     findClassList() {
      const seachForm = {pageNum:1,pageSize: 10000}
      classList(seachForm).then(
        (res) => {
          if (res.status === 200 && res.data.code === "0" && res.data) {
            this.classList = res.data.data.list;
          } else {
            this.message.error(res.data.message)
          }
        },
        (err) => {
          // console.log("错误");
          this.message.error("请求出错");
        }
      );
    },

    /** 人员详情 */
    showStudentInfo() {
      getStudentInfo(this.id).then((res) => {
        if (res.status === 200 && res.data.code === "0") {
          this.studentFrom = res.data.data;
        }
      });
    },

    //设置年龄，采用周岁算法：每过一个生日就长一岁
    setAge(strBirthday) {
      let returnAge,
        strBirthdayArr = strBirthday.split("-"),
        birthYear = strBirthdayArr[0],
        birthMonth = strBirthdayArr[1],
        birthDay = strBirthdayArr[2],
        d = new Date(),
        nowYear = d.getFullYear(),
        nowMonth = d.getMonth() + 1,
        nowDay = d.getDate();
      if (nowYear == birthYear) {
        returnAge = 0; //同年 则为0周岁
      } else {
        let ageDiff = nowYear - birthYear; //年之差
        if (ageDiff > 0) {
          if (nowMonth == birthMonth) {
            let dayDiff = nowDay - birthDay; //日之差
            if (dayDiff < 0) {
              returnAge = ageDiff - 1;
            } else {
              returnAge = ageDiff;
            }
          } else {
            let monthDiff = nowMonth - birthMonth; //月之差
            if (monthDiff < 0) {
              returnAge = ageDiff - 1;
            } else {
              returnAge = ageDiff;
            }
          }
        } else {
          returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
        }
      }
      this.studentFrom.age = returnAge; //得到周岁年龄
    },

    // 返回项目信息管理列表
    backUserInfo() {
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
