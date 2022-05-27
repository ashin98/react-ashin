// 把所有的模块作为统一处理
import React from 'react'
import LoginStore from './login.Store'
import UserStore from './user.store'
import Channel from './channel.Store'

class RootStore {
  constructor() {
    this.loginStore = new LoginStore()
    this.userStore = new UserStore()
    this.channelStore = new Channel()
  }
}

// 实例化根
const rootStore = new RootStore()
const context = React.createContext(rootStore)
export const useStore = () => React.useContext(context)

