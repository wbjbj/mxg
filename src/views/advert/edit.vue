<template>
  <!--弹窗-->
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="handleClose"
    width="600px"
  >
    <!-- status-icon 当表单校验不通过时, 输入框右侧有个 x 小图标 -->
    <el-form
      status-icon
      ref="formData"
      :model="formData"
      label-width="100px"
      label-position="right"
      style="width: 500px"
      :rules="rules"
    >
      <el-form-item label="广告图片:" prop="imageUrl">
        <!--
        accept="image/png, image/jpeg" ：接收上传的类型
        action 指定上传地址，但是我们不用它默认的，所以给它空的，不能把它删除，默认这个必须要有
        show-file-list 是否显示已上传文件列表，因为上传的是图片，不是文件，所以不要显示
        http-request 自定义上传实现
        -->
        <el-upload
          class="avatar-uploader"
          accept="image/*"
          action=""
          :show-file-list="false"
          :http-request="uploadMainImg"
        >
          <img
            v-if="formData.imageUrl"
            :src="formData.imageUrl"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="广告标题:" prop="title">
        <el-input v-model="formData.title" />
      </el-form-item>
      <el-form-item label="广告链接:" prop="advertUrl">
        <el-input v-model="formData.advertUrl" />
      </el-form-item>
      <el-form-item label="跳转方式:" prop="advertTarget">
        <el-select
          v-model="formData.advertTarget"
          clearable
          style="width: 185px"
        >
          <el-option label="新窗口打开" value="_blank"></el-option>
          <el-option label="当前窗口打开" value="_self"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告位置:" prop="position">
        <el-input v-model="formData.position" />
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
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleClose">取 消</el-button>
      <el-button size="mini" type="primary" @click="submitForm('formData')"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<script>
import commonApi from "@/api/common";
// 1. 导航 api
import api from "@/api/advert";
export default {
  data() {
    return {
      rules: {
        // 校验规则
        imageUrl: [
          { required: true, message: "请上传广告图片", trigger: "blur" },
        ],
        title: [{ required: true, message: "请输入广告标题", trigger: "blur" }],
        advertUrl: [
          { required: true, message: "请输入广告链接", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        position: [
          { required: true, message: "请输入广告位置", trigger: "blur" },
        ],
        sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
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
    oldImageUrl: String, // 修改前的照片url
    remoteClose: Function, // 用于关闭窗口
  },
  methods: {
    // 上传主图
    uploadMainImg(file) {
      // 封装表单对象
      const data = new FormData();
      data.append("file", file.file);
      // 发送请求上传
      commonApi
        .uploadImg(data)
        .then((response) => {
          //console.log(response)
          // 以防图片多次上传，上传成功后，把原来的图片删除
          this.deleteImg();
          this.formData.imageUrl = response.data;
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: "上传失败",
            type: "error",
          });
        });
    },
    // 删除主图, 上传成功和关闭窗口调用删除上一次上传的图片
    deleteImg() {
      // 以防上传后，表单没有提交，这样就不能把进入到修改页面时最初的图片删除，如果删除了下次再点击修改，就找不到图片了，
      if (
        this.formData.imageUrl &&
        this.formData.imageUrl !== this.oldImageUrl
      ) {
        //console.log('删除', this.formData.imageUrl, this.oldImageUrl)
        // 删除
        commonApi.deleteImg(this.formData.imageUrl);
      }
    },
    // 关闭弹窗
    handleClose(done) {
      // 表单清空
      this.$refs["formData"].resetFields();
      // this.visible // 错误的，因为它是父组件传递过来的，子组件不能直接改
      // 因为 visible 是父组件的属性，所以要让父组件去改变值
      this.remoteClose();
    },
    //提交表单
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