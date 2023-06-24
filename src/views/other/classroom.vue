<template>
  <div class="app-container">
    <div v-if="!studentFormStatus && !classroomSchedulingPageStatus">
      <div class="filter-container">
        <el-row :gutter="20">
          <el-col :span="1">
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
              placeholder="请输入课室名进行搜索"
              class="filter-item"
              v-model="searchForm.classroomName"
              prefix-icon="el-icon-search"
              @input="findClassroomList"
            />
          </el-col>
        </el-row>
      </div>
      <div class="new-app-container-fragment">
        <el-table stripe border highlight-current-row :data="list" 
        :header-cell-style="{background:'#eef1f6',color:'#606266'}">
          <el-table-column label="课室" prop="classroomName" />
          <el-table-column label="位置" prop="location" />
          <el-table-column label="容量(人)" prop="capacity" />
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
                type="success"
                size="mini"
                round
                @click="changeClassroomSchedulingPageStatus(scope.row.id)"
                >使用详情</el-button
              >
              <el-button
                type="danger"
                size="mini"
                round
                @click="deleteClassroom(scope.row.id, scope.row.className)"
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
      <classroomFormPage :id="id" @closeUserFrom="closeUserFrom" />
    </div>
    <div v-if="classroomSchedulingPageStatus">
      <classroomSchedulingPage :classroomId="id"  @closeClassroomSchedulingPage="changeClassroomSchedulingPageStatus"/>
    </div>
  </div>
</template>

<script>
import { classroomList, deleteClassroomById } from "../../api/other";
import classroomFormPage from "../other/classroomFrom"
import classroomSchedulingPage from "../other/classroomScheduling"

export default {
  components:{classroomFormPage,classroomSchedulingPage},
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
      classroomSchedulingPageStatus:false
    };
  },
  created() {
    this.findClassroomList();
  },
  methods: {
    findClassroomList() {
      console.log("开始进行班级信息查询");
      classroomList(this.searchForm).then(
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
    deleteClassroom(id, className) {
      this.$confirm('确认删除"' + className + '"？', "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(() => {
          deleteClassroomById(id).then(
            (res) => {
              if (res.status === 200 && res.data.code === "0" && res.data) {
                this.$message.success("删除成功");
                this.findClassroomList();
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
      this.findClassroomList();
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

    /** 跳转到 课室使用详情页面 */
    changeClassroomSchedulingPageStatus(id){
      this.id = id;
      this.studentFormStatus = false
      this.classroomSchedulingPageStatus = !this.classroomSchedulingPageStatus;
    },

    /**
     * 关闭用户信息表单页面，并进行刷新
     */
    closeUserFrom() {
      this.studentFormStatus = !this.studentFormStatus;
      this.findClassroomList();
    },

  },
};
</script>
