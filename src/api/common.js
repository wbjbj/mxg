import request from '@/utils/request'
// 公共接口
export default {
  // 上传图片
  uploadImg(data = {}) {
    return request({
      url: `/article/file/upload`,
      method: 'post',
      data // data: data 简写
    })
  },
  // 删除图片
  deleteImg(imageUrl) {
    return request({
      url: `/article/file/delete`,
      method: 'delete',
      params: {
        'fileUrl': imageUrl
      }
    })
  }
}
