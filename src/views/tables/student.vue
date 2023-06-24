<template>
  <div class="app-container">
    <div v-if="!studentFormStatus">
      <div class="filter-container">
        <el-row :gutter="20">
          <el-col :span="2">
            <el-button
              type="primary"
              class="filter-item"
              round
              @click="changStudentStatus('')"
              >新增</el-button
            >
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              class="filter-item"
              round
              @click="handleDownload"
              >导出表单</el-button
            >
          </el-col>
          <el-col :span="6" :offset="14">
            <el-input
              placeholder="请输入姓名进行搜索"
              class="filter-item"
              v-model="searchForm.fullName"
              prefix-icon="el-icon-search"
              @input="findStudentList"
            />
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
          <el-table-column label="姓名" prop="fullName" />
          <el-table-column label="性别" prop="genderDec" />
          <el-table-column label="年龄" prop="age" />
          <el-table-column label="班级" prop="className" />
          <el-table-column label="年级" prop="grade" />
          <el-table-column label="学校" prop="school" show-overflow-tooltip />
          <el-table-column label="已学课时" prop="usedClassHours" />
          <el-table-column label="剩余课时" prop="remainClassHours" />
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                round
                @click="changStudentStatus(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                size="mini"
                round
                @click="deleteStudent(scope.row.id, scope.row.fullName)"
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
          :page-sizes="[10, 20, 40, 50]"
          :page-size="searchForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <div v-if="studentFormStatus">
      <studentFormPage :id="id" @closeUserFrom="closeUserFrom" />
    </div>
  </div>
</template>

<script>
import studentFormPage from "./studentForm";
import { studentList, deleteUserById } from "../../api/user";

export default {
  components: { studentFormPage },

  data() {
    return {
      list: [],
      excelList: [],
      searchForm: {
        fullName: "",
        pageSize: 10,
        pageNum: 1,
      },
      total: "",
      studentFormStatus: false,
    };
  },
  created() {
    this.findStudentList();
  },
  methods: {
    findStudentList() {
      studentList(this.searchForm).then(
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
    //删除学员信息
    deleteStudent(id, fullName) {
      this.$confirm('确认删除"' + fullName + '"的账号？', "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(() => {
          deleteUserById(id).then(
            (res) => {
              if (res.status === 200 && res.data.code === "0" && res.data) {
                this.$message.success("删除成功");
                this.findStudentList();
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
      this.findStudentList();
    },

    /** 格式化日期数据，格式：yyyy-MM-HH */
    dateFormatter(row, column) {
      return row[column.property].substring(0, 10);
    },

    /**
     * 跳转用户信息表页面
     */
    changStudentStatus(id) {
      if (id !== 0 && id !== undefined) {
        this.id = id;
      }
      this.studentFormStatus = !this.studentFormStatus;
    },

    /**
     * 关闭用户信息表单页面，并进行刷新
     */
    closeUserFrom() {
      this.studentFormStatus = !this.studentFormStatus;
      this.findStudentList();
    },

    //导出表单
    handleDownload() {
      studentList({pageSize:1000000,pageNum:1}).then((res) => {
        if (res.status === 200 && res.data.code === "0" && res.data) {
          this.excelList = res.data.data.list;
          this.downloadLoading = true;
          import("@/vendor/Export2Excel").then((excel) => {
            const tHeader = [
              "姓名",
              "性别",
              "年龄",
              "班级",
              "年级",
              "学校",
              "已学课时",
              "剩余课时",
            ];
            const filterVal = [
              "fullName",
              "genderDec",
              "age",
              "className",
              "grade",
              "school",
              "usedClassHours",
              "remainClassHours",
            ];
            const list = this.excelList;
            const data = this.formatJson(filterVal, list);
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: "学员信息表",
              autoWidth: this.autoWidth,
              bookType: this.bookType,
            });
            this.downloadLoading = false;
          });
        } 
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
  },
};
</script>
