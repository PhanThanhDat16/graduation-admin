import { useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  Radio,
  Row,
  Space,
  Typography,
  Upload,
  message
} from 'antd'
import { CameraOutlined, UserOutlined } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import { useAuthStore } from '@/store/useAuthStore'
import { userService } from '@/apis/userService'
import type { UserResponse } from '@/types/user'

const { Title, Text } = Typography

type ProfileFormValues = {
  fullName: string
  email: string
  phone: string
  birthday: Dayjs | null
  gender: string
  address: string
}

const ProfilePage = () => {
  const [form] = Form.useForm<ProfileFormValues>()
  const [saving, setSaving] = useState(false)
  const { user } = useAuthStore()

  const [profile, setProfile] = useState(() => ({ ...user }))

  const fetchUpdateProfile = async (profileData: ProfileFormValues) => {
    try {
      const formattedData = {
        ...profileData,
        birthday: profileData.birthday ? profileData.birthday.format('YYYY-MM-DD') : null
      }
      await userService.editProfile(formattedData)
      setProfile((p: UserResponse) => ({
        ...p,
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        birthday: profileData.birthday ? profileData.birthday.toDate() : p.birthday,
        gender: profileData.gender,
        address: profileData.address
      }))
    } catch (error) {
      console.error('Error updating profile:', error)
      message.error('Cập nhật thông tin thất bại.')
      throw error
    }
  }

  const handleSubmit = async (values: ProfileFormValues) => {
    setSaving(true)
    try {
      await fetchUpdateProfile(values)
      form.setFieldsValue({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        birthday: values.birthday,
        gender: values.gender,
        address: values.address
      })
      message.success('Đã cập nhật thông tin.')
    } catch (error) {
      console.error('Error submitting profile form:', error)
      message.error('Cập nhật thông tin thất bại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Space vertical size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Hồ sơ cá nhân
        </Title>
        <Text type="secondary">Thông tin tài khoản quản trị nội bộ.</Text>
      </div>

      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <Space vertical size="middle" style={{ width: '100%' }}>
              <Avatar size={112} icon={<UserOutlined />} />
              <Upload accept="image/*" showUploadList={false}>
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
                fullName: profile.fullName || '',
                email: profile.email || '',
                phone: profile.phone || '',
                birthday: profile.birthday ? dayjs(profile.birthday) : null,
                gender: profile.gender || '',
                address: profile.address || ''
              }}
              onFinish={handleSubmit}
              requiredMark="optional"
            >
              <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Nhập họ tên' }]}>
                <Input maxLength={120} />
              </Form.Item>
              <Form.Item
                label="Email"
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
              <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Nhập địa chỉ' }]}>
                <Input.TextArea rows={3} maxLength={200} />
              </Form.Item>
              <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: 'Chọn giới tính' }]}>
                <Radio.Group>
                  <Radio value="male">Nam</Radio>
                  <Radio value="female">Nữ</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Ngày sinh" name="birthday" rules={[{ required: true, message: 'Chọn ngày sinh' }]}>
                <DatePicker format="DD/MM/YYYY" />
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
          <Descriptions.Item label="Mã nhân viên">{profile._id}</Descriptions.Item>
          <Descriptions.Item label="Vai trò">{profile.role}</Descriptions.Item>

          <Descriptions.Item label="Tham gia hệ thống">
            {profile.createdAt ? dayjs(profile.createdAt).format('DD/MM/YYYY HH:mm') : '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Space>
  )
}

export default ProfilePage
