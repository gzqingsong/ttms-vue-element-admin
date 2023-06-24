<template>
  <el-dialog
    title="修改"
    width="790px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      inline
      label-width="80px"
      class="tams-form-container"
    >
      <el-form-item label="日期" prop="date">
        <el-date-picker
          v-model="form.date"
          type="date"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :picker-options="datesPickerOptions"
          class="tams-form-item"
        ></el-date-picker>
      </el-form-item>
      <br />
      <el-form-item label="教室" prop="classroomId">
        <el-select
          v-model="form.classroomId"
          class="tams-form-item"
        >
          <el-option
            v-for="item in classroomData"
            :key="item.id"
            :label="item.classroomName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <br />
      <el-form-item label="课程" prop="courseId">
        <el-select
          v-model="form.courseId"
          class="tams-form-item"
          @change="courseChange"
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
      <el-form-item label="老师" prop="teacherId">
        <el-select v-model="form.teacherId" class="tams-form-item">
          <el-option
            v-for="item in teacherData"
            :key="item.id"
            :label="item.fullName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间" prop="attendTime">
        <el-time-select
          :clearable="false"
          style="width: 210px"
          v-model="form.attendTime"
          :picker-options="pickerOptions"
          :key="attendTimeSelectKey"
          @change="calcFinishTime"
        >
        </el-time-select>
      </el-form-item>
      <el-form-item>
        <el-input-number
          v-model="courseDuration"
          style="width: 150px"
          :step="$consts.COURSE_DURATION_STEP_MINUTE"
          :min="0"
          :max="360"
        disabled
          @change="calcFinishTime"
        ></el-input-number>
      </el-form-item>
      <el-form-item prop="finishTime">
        <el-input
          v-model="form.finishTime"
          readonly
          style="width: 210px"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="submitBtnLoading" @click="submit"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import moment from "moment";
import { teacherList } from "../../api/user";
import {
  courseList,
  classroomList,
  getCourseSchedulingById,
  saveOrUpdateCourseScheduling,
} from "../../api/other";

export default {
  name: "UpdateCourseScheduling",
  props: {
    visible: {
      type: Boolean,
    },
    id: [String, Number],
  },
  data() {
    return {
      dialogVisible: false,
      classroomData: [],
      courseData: [],
      teacherData: [],
      form: {
        id: "",
      },
      courseDuration: 0,
      attendTimeSelectKey: new Date().getTime(),
      datesPickerOptions: {
        firstDayOfWeek: 1,
      },
      pickerOptions: {
        start: "07:00",
        step: "00:" + this.$consts.COURSE_DURATION_STEP_MINUTE,
        end: "20:00",
      },
      rules: {
        date: [
          {
            required: true,
            message: "日期不能为空",
            trigger: "blur",
          },
        ],
        classroomId: [
          {
            required: true,
            message: "教室不能为空",
            trigger: "blur",
          },
        ],
        courseId: [
          {
            required: true,
            message: "课程不能为空",
            trigger: "blur",
          },
        ],
        teacherId: [
          {
            required: true,
            message: "老师不能为空",
            trigger: "blur",
          },
        ],
        attendTime: [
          {
            required: true,
            message: "上课时间不能为空",
            trigger: "blur",
          },
        ],
        finishTime: [
          {
            required: true,
            message: "下课时间不能为空",
            trigger: "blur",
          },
        ],
      },
      submitBtnLoading: false,
    };
  },
  methods: {
    init() {
      this.attendTimeSelectKey = new Date().getTime();
      this.findClassroomList(),
        this.findCourseList(),
        this.findTeacherList(),
        this.search();
    },
    search() {
      getCourseSchedulingById(this.id)
        .then((res) => {
          if (res.status === 200 && res.data.code === "0") {
            this.form = res.data.data;
            this.form.attendTime = moment(
              this.form.attendTime,
              "HH:mm:ss"
            ).format("HH:mm");
            this.form.finishTime = moment(
              this.form.finishTime,
              "HH:mm:ss"
            ).format("HH:mm");
            this.courseDuration = this.form.duration;
          }
        })
        .catch(() => {});
    },
    resetData() {
      this.$refs.form.resetFields();
      this.form = {};
      this.courseDuration = 0;
      this.classroomData = [];
      this.courseData = [];
      this.teacherData = [];
    },
    handleClose(done) {
      this.resetData();
      this.$emit("on-close");
      done();
    },
    close() {
      this.resetData();
      this.$emit("on-close");
      this.dialogVisible = false;
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitBtnLoading = true;
          this.form.attendTime = moment(this.form.attendTime, "HH:mm").format(
            "HH:mm:ss"
          );
          this.form.finishTime = moment(this.form.finishTime, "HH:mm").format(
            "HH:mm:ss"
          );
          this.form.id = this.id;
          saveOrUpdateCourseScheduling(this.form).then((res) => {
            if (res.status === 200 && res.data.code === "0") {
              this.submitBtnLoading = false;
              this.$refs.form.resetFields();
              this.$emit("on-success");
              this.dialogVisible = false;
            } else {
              this.$message.error(res.data.message)
              this.form.attendTime = moment(
                this.form.attendTime,
                "HH:mm:ss"
              ).format("HH:mm");
              this.form.finishTime = moment(
                this.form.finishTime,
                "HH:mm:ss"
              ).format("HH:mm");
              this.submitBtnLoading = false;
            }
          });
        }
      });
    },
    courseChange() {
      if (val.duration && val.duration > 0) {
        this.courseDuration = val.duration;
        if (this.form.attendTime) {
          this.$set(
            this.form,
            "finishTime",
            moment(this.form.attendTime, "HH:mm")
              .add(this.courseDuration, "m")
              .format("HH:mm")
          );
        }
      }
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
    //查询课程信息
    findCourseList() {
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
    //查看教室信息
    findClassroomList() {
      const searchForm = {
        pageSize: 1000000,
        pageNum: 1,
      };
      classroomList(searchForm).then((res) => {
        if (res.status === 200 && res.data.code === "0" && res.data) {
          this.classroomData = res.data.data.list;
        }
      });
    },
    calcFinishTime() {
      if (this.form.attendTime) {
        this.$set(
          this.form,
          "finishTime",
          moment(this.form.attendTime, "HH:mm")
            .add(this.courseDuration, "m")
            .format("HH:mm")
        );
      }
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.init();
        this.dialogVisible = val;
      }
    },
  },
};
</script>
