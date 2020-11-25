import request from "@/utils/request"
export default {
 // 列表分页接口
 getList(query, current = 1, size = 20) {
 return request({
 url: `/article/advert/search`,
 method: 'post',
 data: { ...query, current, size } // 合并成一个对象
 })
 },
 add(data) {
   return request({
     url: `/article/advert`,
     method: 'post',
     data
   })
 },
 // 查询
 getById(id) {
     return request({
       url: `/article/advert/${id}`, // 反单引号 ``
       method: 'get'
     })
   },
   // 更新
   update(data) {
     return request({
       url: `/article/advert`,
       method: 'put', // put 方式提交
       data,
     })
   },
   deleteById(id) {
     return request({
       url: `/article/advert/${id}`, // 反单引号 ``
       method: 'delete', // delete 方式提交
     })
   }
}
