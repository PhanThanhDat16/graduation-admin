import { Button, Form, Input, theme, Row, Col, message } from 'antd'
import { UserOutlined, BarChartOutlined, KeyOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { authService } from '@/apis/authService'
import { useNavigate } from 'react-router-dom'

const { useToken } = theme

const ForgotPassword = () => {
  const { token } = useToken()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedEmail = localStorage.getItem('login_email')
    const isRemembered = localStorage.getItem('login_remember') === 'true'

    if (isRemembered && savedEmail && step === 0) {
      form.setFieldsValue({
        email: savedEmail
      })
    }
  }, [form, step])

  const onFinish = async (values: { email?: string; otp?: string }) => {
    try {
      setLoading(true)
      if (step === 0) {
        if (!values.email) return
        await authService.forgotPassword(values.email)
        setEmail(values.email)
        setStep(1)
        form.resetFields(['otp'])
        message.success('OTP has been sent to your email!')
      } else {
        if (!values.otp) return
        const res = (await authService.verifyForgotPassword({ email, otp: values.otp })) as any
        message.success(res.data?.message || 'OTP verified. Please check your email for the new password')
        navigate('/login')
      }
    } catch (error: any) {
      console.log(error)
      message.error(error.response?.data?.message || 'Action failed. Please try again.')
    } finally {
      setLoading(false)
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
          <h1 className="text-5xl font-bold mb-6 tracking-tight">
            {step === 0 ? 'Are you forgot password?' : 'Verification'}
          </h1>
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
              {step === 0 ? 'Forgot Password' : 'Verify OTP'}
            </h2>
            <p style={{ color: token.colorTextSecondary }}>
              {step === 0 ? "Don't worry! It happens. Enter your email" : `Enter the 6-digit code sent to ${email}`}
            </p>
          </div>

          {/* Form */}
          <Form form={form} name="forgot-password" onFinish={onFinish} layout="vertical" size="large">
            {step === 0 ? (
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
            ) : (
              <Form.Item
                key={'otp'}
                name="otp"
                label={<span style={{ color: token.colorText, fontWeight: 500 }}>OTP Code</span>}
                rules={[
                  { required: true, message: 'Please input the OTP code!' },
                  { len: 6, message: 'OTP must be 6 characters!' }
                ]}
              >
                <Input
                  prefix={<KeyOutlined style={{ color: token.colorTextDescription }} />}
                  placeholder="Enter 6-digit code"
                  className="rounded-lg"
                  maxLength={6}
                />
              </Form.Item>
            )}

            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className="h-12 text-lg font-medium"
              >
                {step === 0 ? 'Send OTP to Email' : 'Verify and Reset Password'}
              </Button>
            </Form.Item>

            <div className="text-center">
              {step === 1 ? (
                <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => setStep(0)}>
                  Back to Email
                </Button>
              ) : (
                <Button type="link" onClick={() => navigate('/login')}>
                  Back to Login
                </Button>
              )}
            </div>
          </Form>
        </div>
      </Col>
    </Row>
  )
}

export default ForgotPassword
