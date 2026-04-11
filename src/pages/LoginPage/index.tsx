import { Button, Checkbox, Form, Input, Space, theme, Row, Col } from 'antd'
import { LockOutlined, UserOutlined, BarChartOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect } from 'react'

const { useToken } = theme

const LogInPage = () => {
  const { token } = useToken()
  const [form] = Form.useForm()
  const nav = useNavigate()
  const { loading, logIn } = useAuthStore()

  useEffect(() => {
    const savedEmail = localStorage.getItem('login_email')
    const savedPassword = localStorage.getItem('login_password')
    const isRemembered = localStorage.getItem('login_remember') === 'true'

    if (isRemembered && savedEmail) {
      form.setFieldsValue({
        email: savedEmail,
        password: savedPassword || '',
        remember: true
      })
    }
  }, [form])

  const onFinish = async () => {
    try {
      const values = await form.validateFields()

      // Lưu thông tin đăng nhập nếu remember me được check
      if (values.remember) {
        localStorage.setItem('login_email', values.email)
        localStorage.setItem('login_password', values.password)
        localStorage.setItem('login_remember', 'true')
      } else {
        // Xóa thông tin đăng nhập nếu không check remember me
        localStorage.removeItem('login_email')
        localStorage.removeItem('login_password')
        localStorage.removeItem('login_remember')
      }

      await logIn(values.email, values.password)
      nav('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Space vertical size="large" className="w-full" style={{ background: token.colorBgContainer }}>
      <Row className="min-h-screen">
        <Col
          xs={0}
          lg={12}
          className="bg-gradient-to-br from-blue-600 to-blue-900 flex flex-col justify-center items-center p-12 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full"></div>
            <div className="absolute bottom-40 right-20 w-64 h-64 bg-white rounded-full"></div>
          </div>

          <div className="relative z-10 text-center max-w-md">
            <div className="flex justify-center mb-8">
              <div className="bg-white bg-opacity-20 p-6 rounded-full backdrop-blur-md">
                <BarChartOutlined style={{ fontSize: '48px' }} className="text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6">Welcome Back</h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Sign in to access your dashboard and manage your platform with ease.
            </p>
          </div>
        </Col>

        {/* Right Side - Form */}
        <Col
          xs={24}
          lg={12}
          className="flex flex-col justify-center items-center p-8 sm:p-12"
          style={{ background: token.colorBgLayout }}
        >
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-2" style={{ color: token.colorText }}>
                Sign In
              </h2>
              <p style={{ color: token.colorTextSecondary }}>Enter your credentials to access your account</p>
            </div>

            {/* Form */}
            <Form
              form={form}
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                key={'email'}
                name="email"
                label={<span style={{ color: token.colorText, fontWeight: 500 }}>Email</span>}
                rules={[{ required: true, message: 'Please input your Email!' }]}
              >
                <Input prefix={<UserOutlined className="" />} placeholder="Enter your email" className="rounded-lg" />
              </Form.Item>

              <Form.Item
                key={'password'}
                name="password"
                label={<span style={{ color: token.colorText, fontWeight: 500 }}>Password</span>}
                rules={[{ required: true, message: 'Please input your Password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: token.colorTextSecondary }} />}
                  placeholder="Enter your password"
                  className="rounded-lg"
                />
              </Form.Item>

              <div className="flex justify-between items-center mb-6">
                <Form.Item key={'remember'} name="remember" valuePropName="checked" noStyle>
                  <Checkbox style={{ color: token.colorText }}>Remember me</Checkbox>
                </Form.Item>
                <a href="#" style={{ color: token.colorPrimary }} className="hover:opacity-80 font-medium">
                  Forgot password?
                </a>
              </div>

              <Form.Item>
                <Button block type="primary" htmlType="submit" size="large" disabled={loading}>
                  Sign In
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </Space>
  )
}

export default LogInPage
