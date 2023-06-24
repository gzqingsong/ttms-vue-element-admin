<template>
  <div class="app-container">
    <div v-if="!courseFormStatus">
      <div class="filter-container">
        <el-row :gutter="20">
          <el-col :span="2">
            <el-button
              type="primary"
              class="filter-item"
              round
              @click="saveOrUpdateCourse('')"
              >新增</el-button
            >
          </el-col>
          <el-col :span="6" :offset="16">
            <el-input
              placeholder="请输入课程名进行搜索"
              class="filter-item"
              v-model="searchForm.courseName"
              prefix-icon="el-icon-search"
              @input="findCourseList"
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
          <el-table-column label="课程" prop="courseName" />
          <el-table-column label="总课时" prop="totalClassTime" />
          <el-table-column label="上课时长(分钟)" prop="duration" />
          <el-table-column label="背景颜色">
            <template slot-scope="scope">
              <div
                v-if="scope.row.backgroundColor"
                :style="{
                  height: '23px',
                  width: '100%',
                  borderRadius: '5px',
                  backgroundColor: scope.row.backgroundColor,
                }"
              ></div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                round
                v-if="teacherCourseStatus && studentCourseStatus"
                @click="saveOrUpdateCourse(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                size="mini"
                round
                @click="deleteCourse(scope.row.id, scope.row.courseName)"
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
    <div v-if="courseFormStatus">
      <courseFormPage :id="id" @closeUserFrom="closeUserFrom" />
    </div>
    <div>
      <el-dialog title="新增课程" :visible.sync="dialogFormVisible">
        <el-form inline :model="teacherCourseForm">
          <el-form-item label="课程：">
            <el-select
              clearable
              style="width: 250px"
              v-model="teacherCourseForm.courseId"
            >
              <el-option
                v-for="item in courseData"
                :key="item.id"
                :label="item.courseName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveTeacherCourse">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  courseList,
  deleteCourseById,
  saveTeacherCourse,
  deleteTeacherCourse,
  saveStudentCourse,
  deleteStudentCourse,
} from "../../api/other";
import courseFormPage from "../other/courseForm";
import { getToken } from "@/utils/auth";
import { getInfo } from "../../api/user";
import Item from "@/layout/components/Sidebar/Item.vue";
import tuiEditorViewer from "tui-editor/dist/tui-editor-Viewer";

export default {
  components: { courseFormPage },
  data() {
    return {
      list: [],
      searchForm: {
        studentId: "",
        teacherId: "",
        courseName: "",
        pageSize: 10,
        pageNum: 1,
      },
      teacherCourseForm: {
        teacherId: "",
        courseId: "",
      },
      studentCourseForm: {
        studentId: "",
        courseId: "",
      },
      courseData: [],
      userInfo: {},
      total: "",
      dialogFormVisible: false,
      courseFormStatus: false,
      teacherCourseStatus: true,
      studentCourseStatus: true,
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    findCourseList() {
      courseList(this.searchForm).then(
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
          this.message.error("请求出错");
        }
      );
    },
    //查询课程信息
    findAllCourseList() {
      const searchForm = {
        pageSize: 1000000,
        pageNum: 1,
      };
      courseList(searchForm).then((res) => {
        if (res.status === 200 && res.data.code === "0" && res.data) {
          this.courseData = res.data.data.list;
        }
      });
    },
    deleteCourse(id, courseName) {
      this.$confirm('确认删除"' + courseName + '"？', "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(() => {
          if (
            (this.searchForm.teacherId === null ||
              this.searchForm.teacherId === undefined ||
              this.searchForm.teacherId === "") &&
            (this.searchForm.studentId === null ||
              this.searchForm.studentId === undefined ||
              this.searchForm.studentId === "")
          ) {
            deleteCourseById(id).then(
              (res) => {
                if (res.status === 200 && res.data.code === "0" && res.data) {
                  this.$message.success("删除成功");
                  this.findCourseList();
                } else {
                  this.$message.error("删除失败，请重试");
                }
              },
              (err) => {
                this.$message.error("出错了");
              }
            );
          } else if (
            (this.searchForm.teacherId !== null ||
              this.searchForm.teacherId !== undefined ||
              this.searchForm.teacherId !== "") &&
            (this.searchForm.studentId === null ||
              this.searchForm.studentId === undefined ||
              this.searchForm.studentId === "")
          ) {
            alert("删除jiaoshi");
            this.teacherCourseForm.courseId = id;
            deleteTeacherCourse(this.teacherCourseForm).then((res) => {
              if (res.status === 200 && res.data.code === "0") {
                this.$message.success("删除成功！");
                this.findCourseList();
              } else {
                this.$message.error(res.data.message);
              }
            });
          } else {
            this.studentCourseForm.courseId = id;
            deleteStudentCourse(this.studentCourseForm).then((res) => {
              if (res.status === 200 && res.data.code === "0") {
                this.$message.success("删除成功！");
                this.findCourseList();
              } else {
                this.$message.error(res.data.message);
              }
            });
          }
        })
        .catch((action) => {});
    },
    getUserInfo() {
      const id = getToken();
      getInfo(id).then((res) => {
        if (res.status === 200 && res.data.code === "0") {
          this.userInfo = res.data.data;
          if (this.userInfo.roleName === 1) {
            this.searchForm.teacherId = getToken();
            this.teacherCourseForm.teacherId = getToken();
            this.teacherCourseStatus = false;
          } else if (this.userInfo.roleName === 2) {
            this.searchForm.studentId = getToken();
            this.studentCourseForm.studentId = getToken();
            this.studentCourseStatus = false;
          }
          this.findCourseList();
        }
      });
    },
    saveTeacherCourse() {
      if (
        this.teacherCourseForm.teacherId !== null &&
        this.teacherCourseForm.teacherId !== ""
      ) {
        saveTeacherCourse(this.teacherCourseForm).then((res) => {
          if (res.status === 200 && res.data.code === "0") {
            this.dialogFormVisible = false;
            this.$message.success("新增课程成功");
            this.findCourseList();
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else if (
        this.studentCourseForm.studentId !== null &&
        this.studentCourseForm.studentId !== ""
      ) {
        this.studentCourseForm.courseId = this.teacherCourseForm.courseId;
        saveStudentCourse(this.studentCourseForm).then((res) => {
          if (res.status === 200 && res.data.code === "0") {
            this.dialogFormVisible = false;
            this.$message.success("新增选修课程成功");
            this.findCourseList();
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
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
      this.findCourseList();
    },

    /** 格式化日期数据，格式：yyyy-MM-HH */
    dateFormatter(row, column) {
      return row[column.property].substring(0, 10);
    },

    /**
     * 跳转课程信息表页面
     */
    saveOrUpdateCourse(id) {
      if (
        (this.searchForm.teacherId === null ||
          this.searchForm.teacherId === undefined ||
          this.searchForm.teacherId === "") &&
        (this.searchForm.studentId === null ||
          this.searchForm.studentId === undefined ||
          this.searchForm.studentId === "")
      ) {
        if (id !== 0 && id !== undefined) {
          this.id = id;
        }
        this.courseFormStatus = !this.courseFormStatus;
      } else {
        this.findAllCourseList();
        this.dialogFormVisible = true;
      }
    },

    /**
     * 关闭用户信息表单页面，并进行刷新
     */
    closeUserFrom() {
      this.courseFormStatus = !this.courseFormStatus;
      this.findCourseList();
    },
  },
};
</script>
