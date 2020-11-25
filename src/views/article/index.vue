<template>
  <div class="app-container">
    <el-form :inline="true" size="mini">
      <el-form-item label="文章标题:">
        <el-input v-model.trim="query.title"></el-input>
      </el-form-item>
      <el-form-item label="状态:">
        <!-- clearable 清空按钮，filterable 是否可搜索 -->
        <el-select
          v-model="query.status"
          clearable
          filterable
          style="width: 100px"
        >
          <!-- :value="1" 是数字1，value="1"是字符串“1”
 0: 已删除, 1:未审核，2:审核通过，3：审核未通过-->
          <el-option :value="1" label="未审核"></el-option>
          <el-option :value="2" label="审核通过"></el-option>
          <el-option :value="3" label="审核未通过"></el-option>
          <el-option :value="0" label="已删除"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" class="filter-item" @click="reload"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 数据列表 :data 绑定渲染的数据, border 纵向边框 -->
    <el-table :data="list" border highlight-current-row style="width: 100%">
      <!-- type="index"获取索引值，从1开始 ，label显示标题，prop 数据字段名，width列宽 -->
      <el-table-column align="center" type="index" label="序号" width="60">
      </el-table-column>
      <el-table-column align="center" prop="title" label="文章标题">
      </el-table-column>
      <el-table-column align="center" prop="viewCount" label="浏览量">
      </el-table-column>
      <el-table-column align="center" prop="thumhup" label="点赞数">
      </el-table-column>
      <el-table-column align="center" prop="ispublic" label="是否公开">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.ispublic === 0" type="danger">不公开</el-tag>
          <el-tag v-if="scope.row.ispublic === 1" type="warning">公开</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1">未审核</el-tag>
          <el-tag v-if="scope.row.status === 2" type="success">审核通过</el-tag>
          <el-tag v-if="scope.row.status === 3" type="warning"
            >审核未通过</el-tag
          >
          <el-tag v-if="scope.row.status === 0" type="danger">已删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updateDate" label="最后更新时间">
        <!-- <template slot-scope="scope">
          {{ getFormat(scope.row.updateDate) }}
        </template> -->
      </el-table-column>
      <el-table-column align="left" label="操作" width="220">
        <template slot-scope="scope">
          <!-- ++++ 添加查看 -->
          <el-button size="mini" @click="openView(scope.row.id)" type="primary"
            >查看</el-button
          >
          <el-button
            size="mini"
            v-if="scope.row.status === 1"
            @click="openAudit(scope.row.id)"
            type="success"
            >审核</el-button
          >
          <el-button
            size="mini"
            v-if="scope.row.status !== 0"
            @click="handleDelete(scope.row.id)"
            type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
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
    <audit
      :id="audit.id"
      :isAudit="audit.isAudit"
      :title="audit.title"
      :visible="audit.visible"
      :remoteClose="remoteClose"
    />
  </div>
</template>
<script>
// import { format } from "@/utils/date";
import Audit from "./audit";
import api from "@/api/article";
export default {
  components: { Audit },
  name: "Article", // 和对应路由表中配置的name值一致
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
      audit: {
        // 子组件中引用
        id: null, // 文章id
        isAudit: true, // true 审核，false 详情
        visible: false,
        title: "",
      },
    };
  },
  // 钩子函数获取数据
  created() {
    this.fetchData();
  },
  methods: {
    openView(id) {
      this.audit.id = id; // 文章id
      this.audit.isAudit = false; // 是详情页面
      this.audit.title = "文章详情";
      this.audit.visible = true;
    },
    // 打开审核窗口
    openAudit(id) {
      this.audit.id = id; // 文章id
      this.audit.isAudit = true; // 是审核页面
      this.audit.title = "审核文章";
      this.audit.visible = true;
    },
    // 用于关闭子组件弹出窗口
    remoteClose() {
      this.audit.visible = false;
      this.fetchData();
    },
    // 重置 or 刷新当前页面
    reload() {
      this.query = {};
      this.fetchData();
    },
    // 查询
    queryData() {
      // 将页码变为第1页
      this.page.current = 1;
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
    // getFormat(date) {
    //   return format(date);
    // },
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
              type: "success",
              message: "删除成功",
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