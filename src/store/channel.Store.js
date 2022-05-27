import { makeAutoObservable } from 'mobx'
import { http } from '@/utils'

class Channel {
  channelList = []
  constructor() {
    makeAutoObservable(this)
  }
  getChannel = async () => {
    const res = await http.get('/channels')
    this.channelList = res.data.channels

  }
}

export default Channel