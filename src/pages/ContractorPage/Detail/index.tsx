import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Descriptions,
  Tag,
  Typography,
  Button,
  Space,
  Spin,
  Form,
  Input,
  Select,
  Switch,
  DatePicker,
  Row,
  Col,
  message
} from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { userService } from '@/apis/userService'
import type { UserResponse } from '@/types/user'

const { Title, Text } = Typography

const ContractorDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [contractor, setContractor] = useState<UserResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form] = Form.useForm()

  const fetchDetail = async () => {
    if (!id) return
    try {
      setLoading(true)
      const res = await userService.getUserById(id)
      const data = res.data
      setContractor(data)
      form.setFieldsValue({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        gender: data.gender || 'male',
        status: data.status || 'active',
        birthday: data.birthday ? dayjs(data.birthday) : undefined,
        address: data.address
      })
    } catch (error) {
      console.error('Failed to fetch contractor detail:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetail()
  }, [id])

  const handleSave = async (values: any) => {
    if (!id) return
    try {
      setSaving(true)
      const payload = {
        ...values,
        birthday: values.birthday ? dayjs(values.birthday).toISOString() : undefined,
        role: contractor?.role,
        status: values.status === 'active' ? 'active' : 'disabled'
      }
      await userService.updateUser(id, payload)
      message.success('Cập nhật contractor thành công')
      fetchDetail()
    } catch (error: any) {
      console.error('Failed to update contractor:', error)
      message.error(error?.response?.data?.message || 'Thao tác thất bại')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!contractor) {
    return <div>Không tìm thấy contractor</div>
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
        Quay lại
      </Button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          {contractor.role.toUpperCase()}: {contractor.fullName}
        </Title>
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>
          Lưu thay đổi
        </Button>
      </div>

      <Card>
        <Form form={form} layout="vertical" onFinish={handleSave} requiredMark="optional">
          <Row gutter={24}>
            <Col xs={24} md={8} style={{ textAlign: 'center' }}>
              <Space vertical size="middle" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  {contractor.avatar ? (
                    <img
                      src={contractor.avatar}
                      alt={contractor.fullName}
                      style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto'
                      }}
                    >
                      <Text type="secondary">No Avatar</Text>
                    </div>
                  )}
                </div>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Mã user">{contractor._id}</Descriptions.Item>
                  <Descriptions.Item label="Xác minh">
                    {contractor.isVerified ? (
                      <Tag color="blue">Đã xác minh</Tag>
                    ) : (
                      <Tag color="warning">Chưa xác minh</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tham gia">
                    {dayjs(contractor.createdAt).format('DD/MM/YYYY HH:mm')}
                  </Descriptions.Item>
                </Descriptions>
              </Space>
            </Col>
            <Col xs={24} md={16}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Nhập họ tên' }]}>
                    <Input maxLength={120} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Email" name="email">
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Số điện thoại" name="phone">
                    <Input maxLength={20} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Ngày sinh" name="birthday">
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Giới tính" name="gender">
                    <Select
                      options={[
                        { label: 'Nam', value: 'male' },
                        { label: 'Nữ', value: 'female' },
                        { label: 'Khác', value: 'other' }
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Trạng thái"
                    name="status"
                    valuePropName="checked"
                    getValueProps={(v) => ({ checked: v === 'active' })}
                    getValueFromEvent={(checked) => (checked ? 'active' : 'disabled')}
                  >
                    <Switch checkedChildren="Hoạt động" unCheckedChildren="Vô hiệu" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Địa chỉ" name="address">
                <Input.TextArea rows={3} maxLength={200} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Space>
  )
}

export default ContractorDetail
