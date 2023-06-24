<template>
  <div class="new-app-container-fragment">
    <div v-if="!classroomSchedulingFromStatus">
      <div class="filter-container">
        <el-row :gutter="20">
          <el-col :span='3'>
            <el-button
              type="primary"
              plain
              size="samll"
              round
              @click="closeClassroomSchedulingPage"
              >返回课室列表</el-button
            >
          </el-col>
          <el-col :span='1'>
            <el-button
              type="primary"
              size="samll"
              round
              @click="saveOrUpdateClassroomSchedulingStatus('')"
              >新增</el-button
            >
          </el-col>
          <el-col :span='6' :offset="14">
          <el-form :model="searchForm">
             <el-date-picker
                v-model="searchForm.date"
                type="date"
                value-format="yyyy-MM-dd"
                @change="findClassroomSchedulingList"
                placeholder="选择日期">
              </el-date-picker>
          </el-form>
          </el-col>
        </el-row>
      </div>
      <div class="new-app-container-fragment">
        <el-table stripe border highlight-current-row :data="list" 
        :header-cell-style="{background:'#eef1f6',color:'#606266'}">
          <el-table-column label="使用人" prop="fullname" />
          <el-table-column label="起始时间" :formatter='dateFormatter' prop="startTime" />
          <el-table-column label="截止时间" :formatter='dateFormatter' prop="endTime" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                round
                @click="saveOrUpdateClassroomSchedulingStatus(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                size="mini"
                round
                @click="deleteClassroomSchedulingById(scope.row.id)"
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
    <div v-if="classroomSchedulingFromStatus">
      <classroomSchedulingFormPage 
      :classroomId="classroomId"
      :id="id"
      @closeClassroomSchedulingFromPage="closeClassroomSchedulingFromPage"
       />
    </div>
  </div>
</template>

<script>
import { classroomSchedulingList,deleteClassroomScheduling } from "../../api/other";
import classroomSchedulingFormPage from "./classroomSchedulingFrom"

export default {
  name:'classroomSchedulingPage',
  components:{classroomSchedulingFormPage},
   props: {
    classroomId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      list: [],
      searchForm: {
        classroomId: "",
        pageSize: 10,
        pageNum: 1,
        date:''
      },
      id:'',
      total: "",
      classroomSchedulingFromStatus: false,
    };
  },
  created() {
    this.searchForm.classroomId = this.classroomId
    this.findClassroomSchedulingList();
  },
  methods: {
    findClassroomSchedulingList() {
      classroomSchedulingList(this.searchForm).then(
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
          this.$message.error("请求出错");
        }
      );
    },
    saveOrUpdateClassroomSchedulingStatus(id){
      alert(id)
      this.id = id
      this.classroomSchedulingFromStatus = !this.classroomSchedulingFromStatus
    },


    //删除班级
    deleteClassroomSchedulingById(id) {
      this.$confirm('确认删除？', "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(() => {
          deleteClassroomScheduling(id).then(
            (res) => {
              if (res.status === 200 && res.data.code === "0" && res.data) {
                this.$message.success("删除成功");
                this.findClassroomSchedulingList();
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
      return row[column.property].substring(0, 10)+" "+ row[column.property].substring(11, 19);
    },

    //关闭课室详情列表
    closeClassroomSchedulingPage(){
      this.$emit('closeClassroomSchedulingPage')
    },

    //关闭课室安排表单
    closeClassroomSchedulingFromPage(){
      this.classroomSchedulingFromStatus = !this.classroomSchedulingFromStatus
      this.findClassroomSchedulingList()
    }


  },
};
</script>
