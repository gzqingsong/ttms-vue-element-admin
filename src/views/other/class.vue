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
          <el-col :span="6" :offset="16">
            <el-input
              placeholder="请输入班级名进行搜索"
              class="filter-item"
              v-model="searchForm.className"
              prefix-icon="el-icon-search"
              @input="findClassList"
            />
          </el-col>
        </el-row>
      </div>
      <div class="new-app-container-fragment">
        <el-table stripe border highlight-current-row :data="list" 
        :header-cell-style="{background:'#eef1f6',color:'#606266'}">
          <el-table-column label="班级" prop="className" />
          <el-table-column label="人数" prop="peopleNumber" />
          <el-table-column label="操作">
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
                @click="deleteClass(scope.row.id, scope.row.className)"
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
          :page-sizes="[10, 20, 30,40, 50]"
          :page-size="searchForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <div v-if="studentFormStatus">
      <classFormPage :id="id" @closeUserFrom="closeUserFrom" />
    </div>
  </div>
</template>

<script>
import { classList, deleteClassById } from "../../api/other";
import classFormPage from "../other/classForm"

export default {
  components:{classFormPage},
  data() {
    return {
      list: [],
      searchForm: {
        className: "",
        pageSize: 10,
        pageNum: 1,
      },
      total: "",
      studentFormStatus: false,
    };
  },
  created() {
    this.findClassList();
  },
  methods: {
    findClassList() {
      console.log("开始进行班级信息查询");
      classList(this.searchForm).then(
        (res) => {
          if (res.status === 200 && res.data.code === "0" && res.data) {
            this.list = res.data.data.list;
            this.total = res.data.data.total;
          } else {
            console.log("获取信息失败");
            this.message.error(res.data.message)
          }
        },
        (err) => {
          // console.log("错误");
          this.message.error("请求出错");
        }
      );
    },
    //删除班级
    deleteClass(id, className) {
      this.$confirm('确认删除"' + className + '"？', "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(() => {
          deleteClassById(id).then(
            (res) => {
              if (res.status === 200 && res.data.code === "0" && res.data) {
                this.$message.success("删除成功");
                this.findClassList();
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
      this.findClassList();
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
      this.findClassList();
    },
  },
};
</script>
