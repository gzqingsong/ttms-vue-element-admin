/**
 * 保存或更新事务信息
 */
<template>
  <div class="new-app-container-fragment">
    <el-form
      ref="transactionProcessingForm"
      :model="transactionProcessingForm"
      :rules="rules"
      label-width="100px"
      class="demo-transactionProcessingForm"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>申请信息表</span>
        </div>
        <el-row :gutter="20">
          <el-col>
            <el-form-item
              label="申请人"
              prop="userName"
              v-if="transactionProcessingForm.username"
            >
              <el-input
                v-model="transactionProcessingForm.userName"
                readonly
                clearable
              />
            </el-form-item>
            <el-form-item label="申请事项" prop="items">
              <el-input
                type="textarea"
                v-model="transactionProcessingForm.items"
                :readonly="adminInfoStatus"
                placeholder="请输入申请事项"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="申请原因" prop="applyingReason">
              <el-input
                type="textarea"
                v-model="transactionProcessingForm.applyingReason"
                :readonly="adminInfoStatus"
                placeholder="请输入申请原因"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              label="审核意见"
              prop="auditStatus"
              v-if="adminInfoStatus"
            >
              <el-select
                v-model="transactionProcessingForm.auditStatus"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in auditStatusOptions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              label="审核答复"
              prop="auditExplain"
              v-if="adminInfoStatus"
            >
              <el-input
                v-model="transactionProcessingForm.auditExplain"
                placeholder="请输入审核答复"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="backClassFn">取 消</el-button>
        </el-row>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import {
  saveOrUpdateTransactionProcessing,
  getTransactionProcessingById,
} from "../../api/other";

export default {
  name: "transactionProcessingFormPage",
  props: {
    id: {
      type: String,
      default: "",
    },
    auditorId: {
      type: String,
      default: "",
    },
    userId: {
      type: String,
      default: "",
    },
    teacherInfoStatus: {
      type: Boolean,
      default: false,
    },
    adminInfoStatus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      transactionProcessingForm: {
        userId: "",
        items: "",
        applyingReason: "",
        auditorId: "",
      },
      saveOrUpdateProjectInfoStatus: false,
      projectInfo: null,
      auditStatusOptions: [
        {
          value: "同意申请",
        },
        {
          value: "拒绝申请",
        },
      ],
      rules: {
        items: [{ message: "请输入申请内容", trigger: "blur", required: true }],
        applyingReason: [
          { message: "请输入申请原因", trigger: "blur", required: true },
        ],
        auditStatus: [
          { message: "请选择审核状态", trigger: "change", required: true },
        ],
        auditExplain: [
          { message: "填写审核答复", trigger: "blur", required: true },
        ],
      },
    };
  },
  created() {
    if (this.teacherInfoStatus) {
      this.transactionProcessingForm.userId = this.userId;
    }
    if (this.id !== undefined && this.id !== "") {
      this.showUserInfo();
    }
  },
  methods: {
    submitForm() {
      this.$refs["transactionProcessingForm"].validate((valid) => {
        if (valid) {
          saveOrUpdateTransactionProcessing(
            this.transactionProcessingForm
          ).then(
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
      getTransactionProcessingById(this.id).then((res) => {
        if (res.status === 200 && res.data.code === "0") {
          this.transactionProcessingForm = res.data.data;
          if (this.adminInfoStatus) {
            this.transactionProcessingForm.auditorId = this.auditorId;
          }
          if (this.teacherInfoStatus) {
            this.transactionProcessingForm.userId = this.userId;
          }
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
