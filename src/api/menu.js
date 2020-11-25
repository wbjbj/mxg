import request from "@/utils/request"
export default {
  // 列表分页接口
  getList(query) {
    return request({
      url: `/system/menu/search`,
      method: 'post',
      data: query
    })
  },
  add(data) {
    return request({
      url: `/system/menu`,
      method: 'post',
      data
    })
  },
  // 查询
  getById(id) {
      return request({
        url: `/system/menu/${id}`, // 反单引号 ``
        method: 'get'
      })
    },
    // 更新
    update(data) {
      return request({
        url: `/system/menu`,
        method: 'put', // put 方式提交
        data,
      })
    },
    deleteById(id) {
      return request({
        url: `/system/menu/${id}`, // 反单引号 ``
        method: 'delete', // delete 方式提交
      })
    }
}
