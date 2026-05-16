import { Button, Result, theme } from 'antd'
import { useNavigate } from 'react-router-dom'
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons'

const { useToken } = theme

const NotFoundPage = () => {
  const { token } = useToken()
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: token.colorBgLayout }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 bg-blue-500 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 bg-indigo-500 animate-pulse"></div>

      <div className="relative z-10 w-full max-w-2xl">
        <Result
          status="404"
          title={
            <span className="text-8xl font-black tracking-tighter" style={{ color: token.colorPrimary }}>
              404
            </span>
          }
          subTitle={
            <div className="mt-4">
              <h2 className="text-3xl font-bold mb-2" style={{ color: token.colorText }}>
                Oops! Page Not Found
              </h2>
              <p className="text-lg opacity-70" style={{ color: token.colorTextSecondary }}>
                The page you're looking for might have been removed, had its name changed, or is temporarily
                unavailable.
              </p>
            </div>
          }
          extra={
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                size="large"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                className="h-12 px-8 rounded-xl font-medium"
              >
                Go Back
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
                onClick={() => navigate('/')}
                className="h-12 px-8 rounded-xl font-medium shadow-lg shadow-blue-500/30"
              >
                Back to Dashboard
              </Button>
            </div>
          }
        />
      </div>

      {/* Floating abstract shapes for "rich aesthetics" */}
      <div className="hidden lg:block absolute top-1/4 right-20 w-12 h-12 bg-blue-400 rounded-lg rotate-12 opacity-20 animate-bounce"></div>
      <div className="hidden lg:block absolute bottom-1/4 left-20 w-16 h-16 border-4 border-indigo-400 rounded-full opacity-20 animate-spin"></div>
    </div>
  )
}

export default NotFoundPage
