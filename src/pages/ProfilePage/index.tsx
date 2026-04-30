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
  message,
  Modal,
  Tag
} from 'antd'
import { CameraOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import { useAuthStore } from '@/store/useAuthStore'
import { userService } from '@/apis/userService'

const { Title, Text } = Typography

type ProfileFormValues = {
  fullName: string
  email: string
  phone: string
  birthday: Dayjs | null
  gender: string
  address: string
  avatar: string
}

const ProfilePage = () => {
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [saving, setSaving] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [isChangeEmailModal, setIsChangeEmailModal] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [otpSentChange, setOtpSentChange] = useState(false)
  const [emailForm] = Form.useForm()
  const { user, fetchMe } = useAuthStore()

  const [profile, setProfile] = useState(() => ({ ...user }))

  const handleRequestChangeOtp = async (purpose: string) => {
    try {
      setSendingOtp(true)
      await userService.requestOTP(profile.email as string, purpose)
      message.success('Mã OTP đã được gửi đến email hiện tại của bạn.')
      setOtpSentChange(true)
    } catch (error) {
      console.error('Error requesting OTP:', error)
      message.error('Gửi mã OTP thất bại.')
    } finally {
      setSendingOtp(false)
    }
  }

  const handleEmailChangeSubmit = async (values: { newEmail: string; otp: string }) => {
    setVerifyingOtp(true)
    try {
      const res = await userService.editEmail({
        oldEmail: profile.email as string,
        newEmail: values.newEmail,
        otp: values.otp
      })
      console.log(res)
      message.success('Cập nhật email thành công.')
      setIsChangeEmailModal(false)
      emailForm.resetFields()
      setOtpSentChange(false)
      await fetchMe()
      setProfile((p: any) => ({ ...p, email: values.newEmail }))
    } catch (error) {
      console.error('Error updating email:', error)
      message.error('Cập nhật email thất bại.')
    } finally {
      setVerifyingOtp(false)
    }
  }

  const fetchUpdateProfile = async (profileData: ProfileFormValues) => {
    try {
      const formattedData = {
        ...profileData,
        birthday: profileData.birthday ? profileData.birthday.format('YYYY-MM-DD') : null
      }
      await userService.editProfile(formattedData)
      setProfile((p: any) => ({
        ...p,
        fullName: profileData.fullName,
        phone: profileData.phone,
        birthday: profileData.birthday ? profileData.birthday.toDate() : p.birthday,
        gender: profileData.gender,
        address: profileData.address,
        avatar: profileData.avatar
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

  const handlePasswordChange = async (values: any) => {
    setChangingPassword(true)
    try {
      await userService.editPassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      })
      message.success('Đổi mật khẩu thành công.')
      setIsPasswordModalOpen(false)
      passwordForm.resetFields()
    } catch (error) {
      console.error('Error changing password:', error)
      message.error('Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.')
    } finally {
      setChangingPassword(false)
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
              <Button icon={<LockOutlined />} onClick={() => setIsPasswordModalOpen(true)}>
                Đổi mật khẩu
              </Button>
              <Button icon={<MailOutlined />} onClick={() => setIsChangeEmailModal(true)}>
                Đổi email
              </Button>
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
              <Form.Item label="Email" name="email">
                <Input readOnly maxLength={120} disabled={true} />
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
          <Descriptions.Item label="Xác thực">
            {profile.isVerified ? <Tag color="green">Đã xác thực</Tag> : <Tag color="red">Chưa xác thực</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="Tham gia hệ thống">
            {profile.createdAt ? dayjs(profile.createdAt).format('DD/MM/YYYY HH:mm') : '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal
        title="Đổi mật khẩu"
        open={isPasswordModalOpen}
        onCancel={() => setIsPasswordModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form form={passwordForm} layout="vertical" onFinish={handlePasswordChange}>
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[{ required: true, message: 'Nhập mật khẩu hiện tại' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: 'Nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu phải ít nhất 6 ký tự' }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Xác nhận mật khẩu mới' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp'))
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsPasswordModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={changingPassword}>
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {/* Đổi email */}
      <Modal
        title="Đổi Email"
        open={isChangeEmailModal}
        onCancel={() => {
          setIsChangeEmailModal(false)
          setOtpSentChange(false)
          emailForm.resetFields()
        }}
        footer={null}
        destroyOnHidden
      >
        <Form
          form={emailForm}
          layout="vertical"
          onFinish={handleEmailChangeSubmit}
          initialValues={{ oldEmail: profile.email }}
        >
          <Form.Item label="Email hiện tại" name="oldEmail">
            <Input
              disabled
              suffix={
                <Button
                  type="link"
                  size="small"
                  onClick={() => handleRequestChangeOtp('change_email')}
                  loading={sendingOtp}
                >
                  {otpSentChange ? 'Gửi lại mã' : 'Lấy mã OTP'}
                </Button>
              }
            />
          </Form.Item>
          <Form.Item
            label="Email mới"
            name="newEmail"
            rules={[
              { required: true, message: 'Nhập email mới' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập email mới" />
          </Form.Item>
          <Form.Item label="Mã OTP" name="otp" rules={[{ required: true, message: 'Nhập mã OTP' }]}>
            <Input maxLength={6} placeholder="Nhập mã OTP 6 số" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setIsChangeEmailModal(false)
                  setOtpSentChange(false)
                  emailForm.resetFields()
                }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={verifyingOtp}>
                Xác nhận đổi email
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}

export default ProfilePage
