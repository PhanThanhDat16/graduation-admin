import { useState } from 'react'
import { Button, Card, Divider, Form, Input, Modal, Select, Space, Switch, Typography, message } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { MOCK_ADMIN_SETTINGS, type MockAdminSettings } from '@/mock/adminSettings.mock'

const { Title, Text, Paragraph } = Typography

type SettingsFormValues = MockAdminSettings

const SettingPage = () => {
  const [form] = Form.useForm<SettingsFormValues>()
  const [saving, setSaving] = useState(false)
  const [pwdOpen, setPwdOpen] = useState(false)
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdForm] = Form.useForm<{ current: string; next: string; confirm: string }>()

  const handleSaveSettings = async (values: SettingsFormValues) => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 450))
    form.setFieldsValue(values)
    setSaving(false)
    message.success('Đã lưu cài đặt (mock).')
  }

  const handlePasswordSubmit = async () => {
    try {
      await pwdForm.validateFields()
      setPwdLoading(true)
      await new Promise((r) => setTimeout(r, 600))
      setPwdLoading(false)
      pwdForm.resetFields()
      setPwdOpen(false)
      message.success('Đổi mật khẩu thành công (mock — chưa gọi API).')
    } catch {
      /* validateFields throws */
    }
  }

  return (
    <Space vertical size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Cài đặt
        </Title>
        <Text type="secondary">Tùy chọn hiển thị, thông báo và bảo mật tài khoản quản trị. Lưu cục bộ (mock).</Text>
      </div>

      <Form<SettingsFormValues>
        form={form}
        layout="vertical"
        initialValues={MOCK_ADMIN_SETTINGS}
        onFinish={handleSaveSettings}
        requiredMark="optional"
      >
        <Card title="Ngôn ngữ & định dạng">
          <Form.Item label="Ngôn ngữ giao diện" name="language">
            <Select
              options={[
                { label: 'Tiếng Việt', value: 'vi' },
                { label: 'English', value: 'en' }
              ]}
            />
          </Form.Item>
          <Form.Item label="Múi giờ" name="timezone">
            <Select
              options={[
                { label: 'Việt Nam (UTC+7)', value: 'Asia/Ho_Chi_Minh' },
                { label: 'Singapore', value: 'Asia/Singapore' },
                { label: 'UTC', value: 'UTC' }
              ]}
            />
          </Form.Item>
          <Form.Item label="Định dạng ngày" name="dateFormat">
            <Select
              options={[
                { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
                { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' }
              ]}
            />
          </Form.Item>
        </Card>

        <Card title="Thông báo" style={{ marginTop: 16 }}>
          <Paragraph type="secondary" style={{ marginTop: 0 }}>
            Bật/tắt kênh nhắc việc cho tài khoản của bạn (email nội bộ & trình duyệt).
          </Paragraph>
          <Form.Item label="Email nội bộ" name="notifyEmail" valuePropName="checked">
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
          <Form.Item label="Thông báo trên trình duyệt" name="notifyBrowser" valuePropName="checked">
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
          <Form.Item label="Sự kiện hợp đồng / thanh toán dự án" name="notifyContractEvents" valuePropName="checked">
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
          <Form.Item label="Cảnh báo tranh chấp mới" name="notifyDisputeAlerts" valuePropName="checked">
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
        </Card>

        <Card title="Danh sách & bảng" style={{ marginTop: 16 }}>
          <Form.Item label="Số dòng mặc định mỗi trang (gợi ý cho các bảng)" name="tablePageSize">
            <Select
              options={[
                { label: '8', value: 8 },
                { label: '10', value: 10 },
                { label: '20', value: 20 },
                { label: '50', value: 50 }
              ]}
            />
          </Form.Item>
        </Card>

        <Card title="Bảo mật" style={{ marginTop: 16 }}>
          <Text type="secondary">Đổi mật khẩu đăng nhập admin. Hiện chỉ mô phỏng — cần nối API xác thực sau.</Text>
          <Divider style={{ margin: '12px 0' }} />
          <Button type="default" icon={<LockOutlined />} onClick={() => setPwdOpen(true)}>
            Đổi mật khẩu
          </Button>
        </Card>

        <div style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit" loading={saving} size="large">
            Lưu cài đặt
          </Button>
        </div>
      </Form>

      <Modal
        title="Đổi mật khẩu"
        open={pwdOpen}
        onCancel={() => {
          pwdForm.resetFields()
          setPwdOpen(false)
        }}
        onOk={handlePasswordSubmit}
        confirmLoading={pwdLoading}
        destroyOnClose
      >
        <Form form={pwdForm} layout="vertical" requiredMark="optional">
          <Form.Item
            label="Mật khẩu hiện tại"
            name="current"
            rules={[{ required: true, message: 'Nhập mật khẩu hiện tại' }]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="next"
            rules={[
              { required: true, message: 'Nhập mật khẩu mới' },
              { min: 8, message: 'Tối thiểu 8 ký tự' }
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirm"
            dependencies={['next']}
            rules={[
              { required: true, message: 'Nhập lại mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('next') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Không khớp với mật khẩu mới'))
                }
              })
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}

export default SettingPage
