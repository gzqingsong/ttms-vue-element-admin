<template>
  <div class="app-container">
    <div v-if="!teacherFormStatus">
      <div class="filter-container">
        <el-row :gutter="20">
          <el-col :span="2">
            <el-button
              type="primary"
              class="filter-item"
              round
              @click="changTeacherStatus('')"
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
              @input="findTeacherList"
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
          <el-table-column label="职称" prop="teachersTitle" />
          <el-table-column label="工资" prop="salary" />
          <el-table-column label="加班天数" prop="overDays" />
          <el-table-column label="请假天数" prop="leaveDays" />
          <el-table-column
            label="相关描述"
            prop="description"
            show-overflow-tooltip
          />
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                round
                @click="changTeacherStatus(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                size="mini"
                round
                @click="deleteTeacher(scope.row.id, scope.row.fullName)"
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
    <div v-if="teacherFormStatus">
      <teacherFormPage :id="id" @closeUserFrom="closeUserFrom" />
    </div>
  </div>
</template>

<script>
import teacherFormPage from "./teacherForm";
import { teacherList, deleteUserById } from "../../api/user";

export default {
  components: { teacherFormPage },

  data() {
    return {
      list: [],
      searchForm: {
        fullName: "",
        pageSize: 10,
        pageNum: 1,
      },
      execlList:[],
      total: "",
      teacherFormStatus: false,
    };
  },
  created() {
    this.findTeacherList();
  },
  methods: {
    findTeacherList() {
      teacherList(this.searchForm).then(
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
    //删除教师信息
    deleteTeacher(id, fullName) {
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
                this.findTeacherList();
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
      this.findTeacherList();
    },

    /** 格式化日期数据，格式：yyyy-MM-HH */
    dateFormatter(row, column) {
      return row[column.property].substring(0, 10);
    },

    /**
     * 跳转用户信息表页面
     */
    changTeacherStatus(id) {
      if (id !== 0 && id !== undefined) {
        this.id = id;
      }
      this.teacherFormStatus = !this.teacherFormStatus;
    },

    /**
     * 关闭用户信息表单页面，并进行刷新
     */
    closeUserFrom() {
      this.teacherFormStatus = !this.teacherFormStatus;
      this.findTeacherList();
    },

    //导出表单
    handleDownload() {
      teacherList({pageSize:1000000,pageNum:1}).then((res) => {
        if (res.status === 200 && res.data.code === "0" && res.data) {
          this.execlList = res.data.data.list;
          this.downloadLoading = true;
          import("@/vendor/Export2Excel").then((excel) => {
            const tHeader = [
              "姓名",
              "性别",
              "年龄",
              "职称",
              "工资",
              "请假天数",
              "加班天数",
              "相关描述",
            ];
            const filterVal = [
              "fullName",
              "genderDec",
              "age",
              "teachersTitle",
              "salary",
              "leaveDays",
              "overDays",
              "description",
            ];
            const list = this.execlList;
            const data = this.formatJson(filterVal, list);
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: "教师信息表",
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
