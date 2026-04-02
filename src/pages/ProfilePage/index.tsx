import { useState } from 'react'
import { Avatar, Button, Card, Col, Descriptions, Form, Input, Row, Space, Typography, Upload, message } from 'antd'
import { CameraOutlined, UserOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { MOCK_ADMIN_PROFILE } from '@/mock/adminProfile.mock'
import { STAFF_ROLE_LABEL } from '@/mock/staff.mock'

const { Title, Text } = Typography

type ProfileFormValues = {
  fullName: string
  email: string
  phone: string
}

const ProfilePage = () => {
  const [form] = Form.useForm<ProfileFormValues>()
  const [saving, setSaving] = useState(false)

  const [profile, setProfile] = useState(() => ({ ...MOCK_ADMIN_PROFILE }))

  const handleAvatarBeforeUpload = () => {
    message.info('Ảnh đại diện: chức năng upload sẽ nối API / Cloudinary sau.')
    return false
  }

  const handleSubmit = async (values: ProfileFormValues) => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    setProfile((p) => ({
      ...p,
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim()
    }))
    form.setFieldsValue(values)
    setSaving(false)
    message.success('Đã cập nhật thông tin (mock).')
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Hồ sơ cá nhân
        </Title>
        <Text type="secondary">
          Thông tin tài khoản quản trị nội bộ. Dữ liệu đang dùng mock; sau này đồng bộ từ API.
        </Text>
      </div>

      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <Space vertical size="middle" style={{ width: '100%' }}>
              <Avatar size={112} icon={<UserOutlined />} />
              <Upload accept="image/*" showUploadList={false} beforeUpload={handleAvatarBeforeUpload}>
                <Button icon={<CameraOutlined />}>Đổi ảnh đại diện</Button>
              </Upload>
              <Text type="secondary" style={{ fontSize: 12 }}>
                JPG/PNG, tối đa 2MB (giới hạn khi có API).
              </Text>
            </Space>
          </Col>
          <Col xs={24} md={16}>
            <Form<ProfileFormValues>
              form={form}
              layout="vertical"
              initialValues={{
                fullName: profile.fullName,
                email: profile.email,
                phone: profile.phone
              }}
              onFinish={handleSubmit}
              requiredMark="optional"
            >
              <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Nhập họ tên' }]}>
                <Input maxLength={120} />
              </Form.Item>
              <Form.Item
                label="Email nội bộ"
                name="email"
                rules={[
                  { required: true, message: 'Nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input maxLength={120} />
              </Form.Item>
              <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Nhập số điện thoại' }]}>
                <Input maxLength={20} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={saving}>
                  Lưu thay đổi
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>

      <Card title="Thông tin tổ chức (chỉ xem)">
        <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
          <Descriptions.Item label="Mã nhân viên">{profile.employeeCode}</Descriptions.Item>
          <Descriptions.Item label="Vai trò">{STAFF_ROLE_LABEL[profile.role]}</Descriptions.Item>
          <Descriptions.Item label="Phòng / bộ phận" span={2}>
            {profile.department}
          </Descriptions.Item>
          <Descriptions.Item label="Tham gia hệ thống">
            {dayjs(profile.joinedAt).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Đăng nhập gần nhất">
            {dayjs(profile.lastLoginAt).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Space>
  )
}

export default ProfilePage
