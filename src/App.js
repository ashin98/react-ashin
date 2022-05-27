import { Route, Routes, BrowserRouter } from 'react-router-dom'
import './App.css'
import { AuthComponent } from '@/components/authComponent'  // 路由拦截
import { lazy, Suspense } from 'react'
// 配置路由懒加载
const Login = lazy(() => import('@/pages/Login'))
const Layout = lazy(() => import('./pages/Layout'))
// 导入二级路由组件
const Home = lazy(() => import('./pages/Home'))
const Article = lazy(() => import('./pages/Article'))
const Publish = lazy(() => import('./pages/Publish'))



function App () {
  // 路由配置
  return (
    <>
      <BrowserRouter>
        <Suspense
          fallback={
            <div style={{ textAlign: 'center', color: 'red', marginTop: 200 }}>
              loading...
            </div>
          }>
          <div className="App">
            <Routes>
              <Route path='/login' element={<Login />}></Route>
              <Route path='/' element={
                <AuthComponent>
                  <Layout />
                </AuthComponent>
              }>
                <Route index element={<Home />}></Route>
                <Route path='/article' element={<Article />}></Route>
                <Route path='/publish' element={<Publish />}></Route>
              </Route>
            </Routes>
          </div>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
