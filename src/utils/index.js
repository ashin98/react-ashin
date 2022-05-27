// 把所有的工具函数先在这里导入，然后再统一导出
import { http } from './http'
import { getToken, setToken, removeToken } from './token'

export { http, getToken, setToken, removeToken }