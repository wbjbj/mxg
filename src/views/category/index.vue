<template>
  <div class="app-container">
    <el-form :inline="true" :model="query" size="mini">
      <el-form-item label="分类名称:">
        <el-input v-model.trim="query.name"></el-input>
      </el-form-item>
      <el-form-item label="状态:">
        <!-- clearable 清空按钮，filterable 是否可搜索 -->
        <el-select
          v-model="query.status"
          clearable
          filterable
          style="width: 85px"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" class="filter-item" @click="reload"
          >重置</el-button
        >
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-circle-plus-outline"
          @click="openAdd"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 数据列表 :data 绑定渲染的数据, border 纵向边框 -->
    <el-table :data="list" border highlight-current-row style="width: 100%">
      <!-- type="index"获取索引值，从1开始 ，label显示标题，prop 数据字段名，width列宽 -->
      <el-table-column align="center" type="index" label="序号" width="60">
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="分类名称"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="sort"
        label="排序"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="remark"
        label="备注"
      ></el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">
            {{ scope.row.status ? "正常" : "禁用" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :page-sizes="[10, 20, 50]"
      :page-size="page.size"
      :total="page.total"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
    <!-- 新增与编辑组件 -->
    <edit
      :title="edit.title"
      :visible="edit.visible"
      :formData="edit.formData"
      :remoteClose="remoteClose"
    >
    </edit>
  </div>
</template>

<script>
import api from "@/api/category";
import Edit from "./edit";

// 用于下拉框
const statusOptions = [
  { code: 0, name: "禁用" },
  { code: 1, name: "正常" },
];
export default {
  components: { Edit },
  data() {
    return {
      list: [],
      page: {
        // 分页相关
        total: 0, // 总记录数
        current: 1, // 当前页码
        size: 20, // 每页显示20条数据,
      },
      query: {}, // 查询条件
      statusOptions, //状态下拉框
      edit: {
        // 子组件中引用
        title: "",
        visible: false,
        formData: {
          id: null,
          name: "",
          sort: null,
          remark: "",
        },
      },
    };
  },
  filters: {
    statusFilter(status) {
      // 样式
      const statusMap = { 0: "danger", 1: "success" };
      // status等于0返回danger, 1返回success
      return statusMap[status];
    },
  },

  // 钩子函数获取数据
  created() {
    this.fetchData();
    // console.log(  );
  },
  methods: {
    //打开新增窗口
    openAdd() {
      this.edit.visible = true;
      this.edit.title = "新增";
    },
    // 触发关闭弹出的新增修改子组件窗口
    remoteClose() {
      // 一定要加上这个，不然有时候表单输入不了值
      this.edit.formData = {};
      this.edit.visible = false;
      this.fetchData();
    },
    fetchData() {
      api
        .getList(this.query, this.page.current, this.page.size)
        .then((response) => {
          // console.log(response)
          this.list = response.data.records;
          this.page.total = response.data.total;
        });
    },
    handleEdit(id) {
      // 通过id查询详情
      api.getById(id).then((response) => {
        if (response.code === 20000) {
          // 将查询的详情传递
          this.edit.formData = response.data;
          this.edit.title = "编辑";
          this.edit.visible = true;
        }
      });
    },
    // 删除
    handleDelete(id) {
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 确认
          api.deleteById(id).then((response) => {
            //提示信息
            this.$message({
              type: response.code === 20000 ? "success" : "error",
              message: response.message,
            });
            // 刷新列表
            this.fetchData();
          });
        })
        .catch(() => {
          // 取消删除，不理会
        });
    },
    // 当每页显示条数改变后,被触发 , val是最新的每页显示条数
    handleSizeChange(val) {
      this.page.size = val;
      this.fetchData();
    },
    // 当页码改变后,被触发 , val 是最新的页面
    handleCurrentChange(val) {
      this.page.current = val;
      this.fetchData();
    },
    // 查询
    queryData() {
      // 将页码变为第1页
      this.page.current = 1;
      this.fetchData();
    },
    // 重置 or 刷新当前页面
    reload() {
      this.query = {};
      this.fetchData();
    },
  },
};
</script>

<style lang='scss' scoped>
</style>