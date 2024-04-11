'use client'

import { Button, Form, Input } from 'antd'
import { useRequest } from 'ahooks'
import { useRouter } from 'next/navigation'

const login = async (account: string, password: string) => {
  return fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      account,
      password
    })
  }).then(res => res.json())
}

const LoginForm = () => {
  const [form] = Form.useForm()
  const loginAction = useRequest(login, { manual: true })
  const router = useRouter()
  
  const onFinish = async (values: { account: string; password: string }) => {

    const r = await loginAction.runAsync(values.account, values.password)
    
    router.push('/admin/dashboard')
  }
  
  return (
    <Form onFinish={onFinish} form={form}>
      <Form.Item label="账号" name="account" rules={[{ required: true }]}>
        <Input placeholder="请输入账号" />
      </Form.Item>
      <Form.Item label="密码" name="password" rules={[{ required: true }]}>
        <Input.Password placeholder="请输入密码" />
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="button" onClick={()=>form.submit()}>登录</Button>
      </Form.Item>
    </Form>
  )
}

export default LoginForm
