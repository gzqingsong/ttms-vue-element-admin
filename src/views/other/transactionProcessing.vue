<template>
  <div class="app-container">
    <div v-if="!studentFormStatus">
      <div class="filter-container">
        <el-row :gutter="20">
          <el-col :span="2" v-if="teacherInfoStatus">
            <el-button
              type="primary"
              class="filter-item"
              round
              @click="changStudentStatus('')"
              >新增</el-button
            >
          </el-col>

          <el-col :span="8">
            <el-form-item label="考核月份" prop="month">
              <el-date-picker
                v-model="searchForm.performanceMonth"
                type="month"
                value-format="yyyy-MM"
                placeholder="选择月份"
                @change="searchList"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="new-app-container-fragment">
        <el-table
          stripe
          border
          highlight-current-row
          :data="list"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        >
          <el-table-column
            label="申请时间"
            :formatter="dateFormatter"
            prop="applicationTime"
            show-overflow-tooltip
          />
          <el-table-column
            label="申请人"
            prop="userName"
            v-if="adminInfoStatus"
            show-overflow-tooltip
          />
          <el-table-column
            label="申请事项"
            show-overflow-tooltip
            prop="items"
          />
          <el-table-column
            label="申请原因"
            show-overflow-tooltip
            prop="applyingReason"
          />
          <el-table-column
            label="申请状态"
            show-overflow-tooltip
            prop="auditStatus"
          />
          <el-table-column
            label="审核答复"
            show-overflow-tooltip
            prop="auditExplain"
          />
          <el-table-column
            label="审核人"
            prop="auditorName"
            v-if="teacherInfoStatus"
            show-overflow-tooltip
          />
          <el-table-column
            label="审核时间"
            :formatter="dateFormatter"
            prop="auditTime"
            show-overflow-tooltip
          />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                round
                v-if="editStatus"
                @click="changStudentStatus(scope.row.id)"
              >
                <span v-if="scope.row.auditStatus != '审核中'" style="color:black;">已审核</span>
                <span v-else>
                  {{ edit }}
                </span>
              </el-button>
              <el-button
                type="danger"
                size="mini"
                round
                @click="deleteTransactionProcessing(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="onTableOperate('size-change', $event)"
          @current-change="onTableOperate('page-change', $event)"
          :current-page="searchForm.pageNum"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="searchForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <div v-if="studentFormStatus">
      <transactionProcessingFormPage
        :userId="searchForm.userId"
        :auditorId="searchForm.auditorId"
        :id="id"
        :adminInfoStatus="adminInfoStatus"
        :teacherInfoStatus="teacherInfoStatus"
        @closeUserFrom="closeUserFrom"
      />
    </div>
  </div>
</template>

<script>
import {
  transactionProcessingList,
  deleteTransactionProcessingById,
} from "../../api/other";
import transactionProcessingFormPage from "../other/transactionProcessingForm";
import { getToken } from "@/utils/auth";
import { getInfo } from "../../api/user";

export default {
  components: { transactionProcessingFormPage },
  data() {
    return {
      list: [],
      searchForm: {
        auditorId: "",
        userId: "",
        pageSize: 10,
        pageNum: 1,
      },
      adminInfoStatus: false,
      teacherInfoStatus: false,
      total: "",
      id: "",
      editStatus: true,
      edit: "编辑",
      studentFormStatus: false,
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    findTransactionProcessingList() {
      transactionProcessingList(this.searchForm).then(
        (res) => {
          if (res.status === 200 && res.data.code === "0" && res.data) {
            this.list = res.data.data.list;
            this.total = res.data.data.total;
          } else {
            console.log("获取信息失败");
            this.message.error(res.data.message);
          }
        },
        (err) => {
          // console.log("错误");
          this.message.error("请求出错");
        }
      );
    },

    getUserInfo() {
      const id = getToken();
      getInfo(id).then((res) => {
        if (res.status === 200 && res.data.code === "0") {
          this.userInfoForm = res.data.data;
          this.roleName = res.data.data.roleName;
          switch (this.roleName) {
            case 0:
              this.adminInfoStatus = true;
              this.edit = "待审核";
              this.searchForm.auditorId = id;
              break;
            case 1:
              this.teacherInfoStatus = true;
              this.searchForm.userId = id;
              break;
            default:
              break;
          }
          this.findTransactionProcessingList();
        }
      });
    },
    //删除班级
    deleteTransactionProcessing(id) {
      this.$confirm("确认删除？", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(() => {
          deleteTransactionProcessingById(id).then(
            (res) => {
              if (res.status === 200 && res.data.code === "0" && res.data) {
                this.$message.success("删除成功");
                this.findTransactionProcessingList();
              } else {
                this.$message.error("删除失败，请重试");
              }
            },
            (err) => {
              this.$message.error("出错了");
            }
          );
        })
        .catch((action) => {});
    },
    /** 处理翻页操作*/
    onTableOperate(o, v = null) {
      switch (o) {
        case "size-change":
          this.searchForm.pageSize = v;
          break;
        case "page-change":
          this.searchForm.pageNum = v;
          break;
      }
      this.findTransactionProcessingList();
    },

    dateFormatter(row, column) {
      if (
        row[column.property] !== null &&
        row[column.property] !== "" &&
        row[column.property] !== undefined
      ) {
        return (
          row[column.property].substring(0, 10) +
          " " +
          row[column.property].substring(11, 19)
        );
      }
    },

    /**
     * 跳转用户信息表页面
     */
    changStudentStatus(id) {
      if (id !== 0 && id !== undefined && id != "") {
        this.id = id;
      }
      this.studentFormStatus = !this.studentFormStatus;
    },

    /**
     * 关闭用户信息表单页面，并进行刷新
     */
    closeUserFrom() {
      this.studentFormStatus = !this.studentFormStatus;
      this.findTransactionProcessingList();
    },
  },
};
</script>
