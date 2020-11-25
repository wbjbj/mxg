<template>
  <!--弹窗-->
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="handleClose"
    width="500px"
  >
    <!-- status-icon 当表单校验不通过时, 输入框右侧有个 x 小图标 -->
    <el-form
      status-icon
      ref="formData"
      :model="formData"
      label-width="100px"
      label-position="right"
      style="width: 400px"
      :rules="rules"
    >
      <el-form-item label="分类名称:" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序:" prop="sort">
        <el-input-number
          style="width: 300px"
          v-model="formData.sort"
          :min="1"
          :max="10000"
        />
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入备注"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formData')" size="mini">
          确定</el-button
        >
        <el-button size="mini" @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import api from "@/api/category";
export default {
  data() {
    return {
      rules: {
        // 校验规则
        name: [
          // 与 el-form-item 标签的 prop 属性值对应
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        sort: [{ required: true, message: "请输入排序号", trigger: "change" }],
      },
    };
  },
  // 接收父组件传递的属性
  props: {
    visible: {
      //弹出隐藏
      type: Boolean,
      default: false,
    },
    title: {
      // 标题
      type: String,
      default: "",
    },
    formData: {
      // 表单数据
      type: Object,
      default: {},
    },
    remoteClose: Function, // 用于关闭窗口
  },
  methods: {
    // 关闭弹窗
    handleClose(done) {
      // 表单清空
      this.$refs["formData"].resetFields();
      // this.visible // 错误的，因为它是父组件传递过来的，子组件不能直接改
      // 因为 visible 是父组件的属性，所以要让父组件去改变值
      this.remoteClose();
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 校验通过，提交数据
          this.submitData();
        } else {
          // 验证不通过
          return false;
        }
      });
    },

    // 异步方法提交数据
    async submitData() {
      let response = null;
      // // 有 id 值则修改，没有id则新增
      if (this.formData.id) {
        response = await api.update(this.formData);
      } else {
        response = await api.add(this.formData);
      }
      // 等上面返回数据response后再进行处理
      if (response.code === 20000) {
        // 提交成功, 关闭窗口, 刷新列表
        this.$message({
          message: "保存成功",
          type: "success",
        });
        // 关闭窗口
        this.handleClose();
      } else {
        this.$message({
          type: "error",
          message: "保存失败",
        });
      }
    },
  },
};
</script>
