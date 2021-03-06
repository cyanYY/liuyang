import axios from '@/utils/request'

export function listPage(params) {
  const url = '/profit/listPage'
  return axios.post(url, params).then(res => res.data)
}

export function editCost(params) {
  const url = '/profit/editCost'
  return axios.post(url, params).then(res => res.data)
}

export function listPageDeliver(params) {
  const url = '/profit/listPageDeliver'
  return axios.post(url, params).then(res => res.data)
}
