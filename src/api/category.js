import request from '@/utils/request'

export default {
  //分液器条快件查询分类列表
  getList(query, current = 1, size = 20) {
    return request({ //Promise
      url: '/article/category/search',
      method: 'post',
      data: { //{name: '前端', status: 1, current: current, size: size}
        ...query,
        current,
        size
      }
    })
  },
  add(data) {
    return request({
      url: `/article/category`,
      method: 'post',
      ...data
    })
  },
  // 查询
  getById(id) {
    return request({
      url: `/article/category/${id}`, // 反单引号 ``
      method: 'get'
    })
  },
  // 更新
  update(data) {
    return request({
      url: `/article/category`,
      method: 'put', // put 方式提交
      data
    })
  },
  deleteById(id) {
    return request({
      url: `/article/category/${id}`, // 反单引号 ``
      method: 'delete', // delete 方式提交
    })
  },
  //获取所有正常状态的分类
  getNormalList() {
    return request({
      url: `/article/category/list`,
      method: 'get'
    })
  },
  //获取所有正常状态的分类和标签
  getCategoryAndLabel() {
    return request({
      url: `/article/category/label/list`,
      method: 'get'
    })
  },
  // 审核通过
  auditSuccess(id) {
      return request({
        url: `/article/article/audit/success/${id}`, // 反单引号 ``
        method: 'get',
      })
    },
    // 审核不通过
    auditFail(id) {
      return request({
        url: `/article/article/audit/fail/${id}`, // 反单引号 ``
        method: 'get',
      })
    }
}
