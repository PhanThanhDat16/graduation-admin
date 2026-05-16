import { Button, Checkbox, Form, Input, theme, Row, Col } from 'antd'
import { LockOutlined, UserOutlined, BarChartOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
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
    <Row className="min-h-screen w-full" style={{ background: token.colorBgContainer }}>
      <Col
        xs={0}
        lg={12}
        className="bg-gradient-to-br from-blue-600 to-blue-900 flex flex-col justify-center items-center p-12 text-white relative overflow-hidden w-full"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-40 right-20 w-64 h-64 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10 text-center max-w-md">
          <div className="flex justify-center mb-8">
            <div className="bg-white bg-opacity-20 p-6 rounded-3xl backdrop-blur-md transform rotate-12">
              <BarChartOutlined style={{ fontSize: '48px' }} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 tracking-tight">Welcome Back</h1>
          <p className="text-lg text-blue-100 mb-8 leading-relaxed">
            Sign in to access your dashboard and manage your platform with ease.
          </p>
        </div>
      </Col>

      {/* Right Side - Form */}
      <Col
        xs={24}
        lg={12}
        className="flex flex-col justify-center items-center p-6 sm:p-12 md:p-20 lg:p-12"
        style={{ background: token.colorBgLayout }}
      >
        <div className="w-full max-w-md">
          {/* Logo for mobile/tablet */}
          <div className="lg:hidden flex justify-center mb-10">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-lg transform rotate-12">
              <BarChartOutlined style={{ fontSize: '32px' }} className="text-white" />
            </div>
          </div>

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
              rules={[
                { required: true, message: 'Please input your Email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: token.colorTextDescription }} />}
                placeholder="Enter your email"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              key={'password'}
              name="password"
              label={<span style={{ color: token.colorText, fontWeight: 500 }}>Password</span>}
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: token.colorTextDescription }} />}
                placeholder="Enter your password"
                className="rounded-lg"
              />
            </Form.Item>

            <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
              <Form.Item key={'remember'} name="remember" valuePropName="checked" noStyle>
                <Checkbox style={{ color: token.colorText }}>Remember me</Checkbox>
              </Form.Item>
              <Link
                to={'/forgotpassword'}
                style={{ color: token.colorPrimary }}
                className="hover:opacity-80 font-medium transition-opacity"
              >
                Forgot password?
              </Link>
            </div>

            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className="h-12 text-lg font-medium"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  )
}

export default LogInPage
