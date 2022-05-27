// 封装存取移除token函数

const key = "pc-key"
function getToken () {
  return window.localStorage.getItem(key)
}

function setToken (token) {
  return window.localStorage.setItem(key, token)
}

function removeToken () {
  return window.localStorage.removeItem(key)
}

export { getToken, setToken, removeToken }