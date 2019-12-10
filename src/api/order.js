import axios from '@/utils/request'

// 分页查询订单列表
export function listPage(params) {
  const url = '/wayBill/orderListPage'
  return axios.post(url, params).then(res => res.data)
}

// 导入订单
export function uploadOrder(params) {
  const url =
    '/wayBill/orderUpload?fileName=' + params.fileName + '&merchantId=' + params.merchantId
  return axios.post(url, params).then(res => res.data)
}

// 新增订单
export function addOrder(params) {
  const url = '/wayBill/addOrder'
  return axios.post(url, params).then(res => res.data)
}

// 修改订单
export function updateOrder(params) {
  const url = '/wayBill/updateOrder'
  return axios.post(url, params).then(res => res.data)
}

// 导入线下订单
export function uploadOffOrder(params) {
  const url =
    '/wayBill/offOrderUpload?fileName=' + params.fileName + '&merchantId=' + params.merchantId
  return axios.post(url, params).then(res => res.data)
}

// 导入超区订单
export function uploadExrOrder(params) {
  const url =
    '/wayBill/exrOrderUpload?fileName=' + params.fileName + '&merchantId=' + params.merchantId
  return axios.post(url, params).then(res => res.data)
}

// 导入账单
export function uploadBill(params) {
  const url = '/wayBill/billUpload?fileName=' + params.fileName
  return axios.post(url, params).then(res => res.data)
}

// 分页查询账单列表
export function listPageBill(params) {
  const url = '/wayBill/billListPage'
  return axios.post(url, params).then(res => res.data)
}

// 分页查询成功率
export function successRate(params) {
  const url = '/wayBill/successRate'
  return axios.post(url, params).then(res => res.data)
}