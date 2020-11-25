<template>
  <!--弹窗-->
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="handleClose"
    width="500px"
  >
    <el-form
      ref="formData"
      :model="formData"
      label-width="100px"
      style="width: 400px"
      status-icon
      :rules="rules"
    >
      <el-form-item label="类型：" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio :label="1">目录</el-radio>
          <el-radio :label="2">菜单</el-radio>
          <!-- 如果 formData.parentId=0 是根菜单，就不显示按钮，注意是数字0，不是字符串没有引号 -->
          <el-radio :label="3" v-if="formData.parentId !== 0">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 按钮：不要显示 请求地址url、 图标icon , 在按钮上对应的写明就行，所以不需要-->
      <el-form-item label="名称：" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="权限标识：" prop="code">
        <el-input v-model="formData.code"></el-input>
      </el-form-item>
      <el-form-item label="请求地址：" prop="url" v-if="formData.type != 3">
        <el-input v-model="formData.url"></el-input>
      </el-form-item>
      <el-form-item label="图标：" prop="icon" v-if="formData.type != 3">
        <el-input v-model="formData.icon"></el-input>
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input-number v-model="formData.sort" :min="1" :max="10000" />
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入内容"
        >
        </el-input>
      </el-form-item>
      <el-form-item align="right">
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm('formData')"
          >确 定
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
// 1. 导航 api
import api from "@/api/menu";
export default {
  data() {
    return {
      rules: {
        // 校验规则
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入权限标识", trigger: "blur" }],
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
      // 因为 visible 是父组件的属性，所以要让父组件去改变值
      this.remoteClose();
    },
    //2. 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 校验通过，判断下选择的类型，把对应不需要的把它清空
          if (this.formData.type == 3) {
            // 按钮
            this.formData.url = ""; // 请求地址url
            this.formData.icon = ""; // 图标
          }
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