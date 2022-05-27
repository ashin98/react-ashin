import React from 'react'
import './index.scss'
import { Card, Form, Input, Button, Checkbox, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import logo from '@/assets/logo.png'
import { useStore } from '../../store'

export default function Login () {
  const { loginStore } = useStore()
  const navigate = useNavigate()
  const success = () => {
    message.success('登录成功')
  }
  const onFinish = async (values) => {
    console.log('Received values of form: ', values)
    await loginStore.getToken({
      mobile: values.mobile,
      code: values.code
    })
    // 跳转首页
    navigate('/', { replace: true })
    // 提示登录成功
    success()
  }

  return (
    <div className='login'>
      <Card className='login-container'>
        <img className='login-logo' src={logo} alt="" />
        {/* 登录表单 */}
        <Form
          onFinish={onFinish}
          validateTrigger={['onBlur', 'onChange']}
          initialValues={{
            remember: true,
            mobile: 13169229226,
            code: 246810
          }}
        >
          <Form.Item
            name="mobile"
            rules={[
              {
                required: true,
                message: '手机号不能为空',
                validateTrigger: 'onBlur'
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '手机号码格式不对',
                validateTrigger: 'onBlur'
              },
            ]}>
            <Input size="large" placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="code"
            rules={
              [
                {
                  required: true,
                  message: '请输入验证码',
                  validateTrigger: 'onBlur'
                }
              ]
            }
          >
            <Input size="large" placeholder="请输入验证码" />
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"
            noStyle
            rules={[
              {
                required: true,
                message: '请阅读用户协议'
              }
            ]}
          >
            <Checkbox className="login-checkbox-label">
              我已阅读并同意「用户协议」和「隐私条款」
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}