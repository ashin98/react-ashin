// 封装路由鉴权(路由拦截)，类似于vue中的router.beforeEach
// 高阶组件：把一个组件当成另外一个组件的参数传入
// 然后通过一定的判断  返回新的组件

import { getToken } from '@/utils'
import { Navigate } from 'react-router-dom'

function AuthComponent ({ children }) {
  const isToken = getToken()
  if (isToken) {
    // 如果有token 直接返回children组件
    return <>{children}</>
  } else {
    // 如果没有token，重定向到登录界面
    return <Navigate to='/login' replace />
  }
}
export { AuthComponent }

//  <AuthComponent> <Layout /> </AuthComponent>
// 登录的时候：  <> <Layout/> </>\
// 非登录的时候：  <Navigate to='/login' replace />