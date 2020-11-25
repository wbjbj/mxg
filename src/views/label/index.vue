<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <el-form :inline="true" size="mini">
      <el-form-item label="标签名称:">
        <el-input v-model.trim="query.name"></el-input>
      </el-form-item>
      <el-form-item label="分类名称:">
        <!-- clearable 清空按钮，filterable 是否可搜索 -->
        <el-select v-model="query.categoryId" clearable filterable>
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
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
        >
          新增
        </el-button>
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
        label="标签名称"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="categoryName"
        label="分类名称"
      ></el-table-column>
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
    <!-- 新增与修改组件 -->
    <edit
      :categoryList="categoryList"
      :title="edit.title"
      :visible="edit.visible"
      :formData="edit.formData"
      :remoteClose="remoteClose"
    >
    </edit>
  </div>
</template>
<script>
import categoryApi from "@/api/category";
import api from "@/api/label";
import Edit from "./edit";
export default {
  components: { Edit },
  name: "Lable", // 和对应路由表中配置的name值一致
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
      categoryList: [], // 2. 数组存储正常状态的分类
      edit: {
        // 子组件中引用
        title: "",
        visible: false,
        formData: {},
      },
    };
  },
  // 钩子函数获取数据
  created() {
    this.fetchData();
    // 3. 获取所有正常的分类
    this.getCategoryList();
  },
  methods: {
    //打开新增窗口
    openAdd() {
      // 打开时，重新查询正常状态的分类数据
      this.getCategoryList();
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

    // 4. 获取所有状态为正常的分类，用于条件查询中
    getCategoryList() {
      categoryApi.getNormalList().then((response) => {
        this.categoryList = response.data;
      });
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
    fetchData() {
      api
        .getList(this.query, this.page.current, this.page.size)
        .then((response) => {
          this.list = response.data.records;
          this.page.total = response.data.total;
        });
    },
    handleEdit(id) {
      // console.log('编辑', id)
      api.getById(id).then((response) => {
        if (response.code === 20000) {
          this.edit.formData = response.data;
          //弹出窗口
          this.edit.visible = true;
          this.edit.title = "编辑";
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
  },
};
</script>