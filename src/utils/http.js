// 封装axios
// 实例化 请求拦截器 响应拦截器
import axios from 'axios'
import { getToken, removeToken } from './token'
const http = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: 5000
})

// 添加请求拦截器
http.interceptors.request.use((config) => {
  // 添加token
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 添加响应拦截器
http.interceptors.response.use((response) => {
  // 2xx 状态码都会触发该函数
  // 对响应数据做点什么
  return response.data
}, error => {
  // token过期，返回401状态码 清除token并且跳回登录页
  if (error.response.status === 401) {
    window.location.href = '/login'
    removeToken()
  }
  return Promise.reject(error)
})

export { http } 