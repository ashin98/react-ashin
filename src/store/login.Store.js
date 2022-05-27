import { makeAutoObservable } from 'mobx'
import { http, getToken, setToken, removeToken } from '@/utils'
class LoginStore {
  token = getToken() || ''
  constructor() {
    makeAutoObservable(this)
  }
  getToken = async ({ mobile, code }) => {
    // 1.调用登录接口
    const res = await http.post('/authorizations', {
      mobile, code
    })

    // 2.存token值
    this.token = res.data.token
    // 存入localstorage中
    setToken(this.token)
  }
  clearToken () {
    this.token = ''
    removeToken()
  }
}
class Test {
  a = 'ashin'
}

export default LoginStore 