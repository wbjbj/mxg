<template>
  <div class="app-container">
    <el-form :inline="true" size="mini">
      <el-form-item label="菜单名称：">
        <el-input v-model.trim="query.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="fetchData"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" class="filter-item" @click="reload"
          >重置</el-button
        >
        <!-- 条件区域参数传 0 -->
        <el-button
          @click="handleAdd(0)"
          type="primary"
          size="mini"
          icon="el-icon-circle-plusoutline"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 数据列表 :data 绑定渲染的数据, border 纵向边框 -->
    <!-- 渲染树形数据时，必须要指定 row-key, list集合中的 id属性 -->
    <el-table
      :data="list"
      row-key="id"
      border
      highlight-current-row
      style="width: 100%"
    >
      <!-- type="index"获取索引值，从1开始 ，label显示标题，prop 数据字段名，width列宽 -->
      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="60"
      ></el-table-column>
      <el-table-column align="left" prop="name" label="名称"></el-table-column>
      <el-table-column
        align="center"
        prop="url"
        label="请求地址"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="code"
        label="权限标识"
      ></el-table-column>
      <el-table-column align="center" prop="type" label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">目录</span>
          <span v-if="scope.row.type === 2">菜单</span>
          <span v-if="scope.row.type === 3">按钮</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="code" label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="sort"
        label="排序"
      ></el-table-column>
      <el-table-column align="center" label="操作" width="260">
        <template slot-scope="scope">
          <!-- 列表区域参数传 菜单id -->
          <el-button
            @click="handleAdd(scope.row.id)"
            size="mini"
            type="primary"
            icon="el-iconcircle-plus-outline"
            >新增</el-button
          >
          <el-button @click="handleEdit(scope.row.id)" size="mini"
            >编辑</el-button
          >
          <el-button
            @click="handleDelete(scope.row.id)"
            size="mini"
            type="danger"
          >
            删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
import api from "@/api/menu";
import Edit from "./edit";
export default {
  components: { Edit },
  data() {
    return {
      query: {}, // 查询条件
      list: [], // 列表数据
      edit: {
        // 子组件中引用
        title: "",
        visible: false,
        formData: {},
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    //打开新增窗口
    handleAdd(id) {
      // id=0 是新增一级菜单，其他值是新增到此id下的作为子菜单
      this.edit.formData.parentId = id;
      this.edit.visible = true;
      this.edit.title = "新增";
    },
    // 触发关闭弹出的新增修改子组件窗口
    remoteClose() {
      this.edit.formData = {};
      this.edit.visible = false;
      this.fetchData();
    },
    // 重置 or 刷新当前页面
    reload() {
      this.query = {};
      this.fetchData();
    },
    fetchData() {
      api.getList(this.query).then((response) => {
        this.list = response.data;
        // console.log(this.list)
      });
    },
    // 编辑菜单
    handleEdit(id) {
      api.getById(id).then((response) => {
        if (response.code === 20000) {
          this.edit.formData = response.data;
          //设置标题
          this.edit.title = "编辑";
          this.edit.visible = true;
        }
      });
    },
    // 删除
    handleDelete(id) {
      this.$confirm("确认删除当前节点与子节点记录吗？", "提示", {
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
  },
};
</script>