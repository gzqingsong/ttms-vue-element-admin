/**
 * 保存或更新人员信息
 */
<template>
  <div class="new-app-container-fragment">
    <el-form
      ref="userForm"
      :model="userForm"
      :rules="rules"
      label-width="100px"
      class="demo-userForm"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>人员信息表</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="姓名" prop="fullName">
              <el-input v-model="userForm.fullName" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别" prop="gender">
              <el-select
                v-model="userForm.gender"
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
              <el-input v-model="userForm.username" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="密码" prop="password">
              <el-input v-model="userForm.password" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="生日" prop="birthDate">
              <el-date-picker
                v-model="userForm.birthDate"
                value-format="yyyy-MM-dd"
                type="date"
                clearable
                @change="setAge(userForm.birthDate)"
                style="width: 150px"
                placeholder="请选择"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年龄" prop="age">
              <el-input v-model="userForm.age" disabled clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系方式" prop="contactWay">
              <el-input v-model="userForm.contactWay" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="角色" prop="roleName">
              <el-select
                v-model="userForm.roleName"
                clearable
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in roleNameOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button type="primary" @click="submitUserForm">保存</el-button>
          <el-button @click="backUserInfo">取消</el-button>
        </el-row>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import { getInfo,saveOrUpdateUser } from "../../api/user";

export default {
  name: "userForm",
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      userForm: {
        id: "",
        fullName: "",
        username: "",
        password: "",
        birthDay: "",
        gender: "",
        age: "",
        contactWay: "",
        roleName: "",
        
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
      roleNameOptions: [
        {
          label: "管理员",
          value: 0,
        },
        {
          label: "教师",
          value: 1,
        },
        {
          label: "学员",
          value: 2,
        },
      ],
      saveOrUpdateProjectInfoStatus: false,
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
    if (this.id !== undefined && this.id !== "") {
      console.log("开始执行请求");
      this.showUserInfo()
    }
  },
  methods: {
    submitUserForm() {
      this.$refs["userForm"].validate((valid) => {
        if (valid) {
          console.log(this.userForm);
          saveOrUpdateUser(this.userForm).then(
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
      this.userForm.age = returnAge; //得到周岁年龄
    },

    /** 人员详情 */
    showUserInfo() {
      getInfo(this.id).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.code === "0") {

          this.userForm = res.data.data;
        }
      });
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
