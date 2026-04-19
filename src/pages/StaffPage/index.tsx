import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Space,
  Switch,
  Typography,
  message,
  DatePicker,
  Select,
  Row,
  Col
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { userService } from '@/apis/userService'
import type { UserQuery, UserResponse } from '@/types/user'
import type { FilterConfig } from '@/components/common/AppFilters'
import TableStaff from './Table'
import AppFilters from '@/components/common/AppFilters'
import { STAFF_PAGE } from '@/constants'

const { Title, Text } = Typography

const StaffFilters: FilterConfig[] = [
  {
    type: 'input',
    name: 'keyword',
    placeholder: 'Tìm kiếm theo tên, email',
    label: 'Tìm kiếm'
  },
  {
    type: 'select',
    name: 'status',
    placeholder: 'Trạng thái',
    options: [
      {
        label: 'Hoạt động',
        value: 'active'
      },
      {
        label: 'Không hoạt động',
        value: 'disabled'
      }
    ],
    label: 'Trạng thái'
  },
  {
    type: 'select',
    name: 'isVerified',
    placeholder: 'Trạng thái',
    options: [
      {
        label: 'Đã xác minh',
        value: 'true'
      },
      {
        label: 'Chưa xác minh',
        value: 'false'
      }
    ],
    label: 'Xác thực'
  },
  {
    type: 'select',
    name: 'sortBy',
    placeholder: 'Sắp xếp tên, ngày tạo...',
    options: [
      {
        label: 'Tên',
        value: 'fullName'
      },
      {
        label: 'Ngày tạo',
        value: ''
      }
    ],
    label: 'Sắp xếp theo'
  },
  {
    type: 'select',
    name: 'sortOrder',
    placeholder: 'Tăng dần, giảm dần',
    options: [
      {
        label: 'Tăng dần',
        value: 'asc'
      },
      {
        label: 'Giảm dần',
        value: 'desc'
      }
    ],
    label: 'Thứ tự'
  }
]

type FormStaff = {
  email: string
  fullName: string
  password?: string
  phone: string
  address: string
  birthday: any
  gender: 'male' | 'female'
  status: 'active' | 'disabled'
  role: 'staff'
}

const StaffPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<UserResponse | null>(null)
  const [form] = Form.useForm<FormStaff>()

  const [query, setQuery] = useState<UserQuery>({
    role: 'staff',
    keyword: '',
    status: '',
    page: 1,
    limit: 10,
    sortBy: '',
    sortOrder: ''
  })
  const [staffList, setStaffList] = useState<UserResponse[]>([])

  const handleGetValueFilter = (values: Record<string, any>) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      keyword: values.keyword || '',
      status: values.status || '',
      sortBy: values.sortBy || '',
      sortOrder: values.sortOrder || '',
      isVerified: values.isVerified || undefined
    }))
  }

  const handleChangePageSizeTable = (newPage: number, newSize: number) => {
    setQuery((prev) => ({
      ...prev,
      page: newPage,
      limit: newSize
    }))
  }

  const handleViewDetail = (record: UserResponse) => {
    navigate(`${STAFF_PAGE}/${record._id}`)
  }

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({
      fullName: '',
      email: '',
      status: 'active'
    })
    setModalOpen(true)
  }

  const fetchStaff = async () => {
    try {
      setIsLoading(true)
      const res = await userService.getUsersByRole(query)
      const payload = res.data || {
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
      }
      setStaffList(payload.data || [])
      if (payload.pagination) {
        setQuery((prev) => ({
          ...prev,
          page: payload.pagination.page,
          limit: payload.pagination.limit,
          pagination: payload.pagination
        }))
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch staff:', error)
      setIsLoading(false)
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      setIsSubmitting(true)

      const payload = {
        ...values,
        birthday: values.birthday ? dayjs(values.birthday).toISOString() : undefined,
        role: 'staff'
      }

      if (editing) {
        await userService.updateUser(editing._id, payload)
        message.success('Cập nhật nhân viên thành công')
      } else {
        await userService.createStaff(payload)
        message.success('Thêm nhân viên thành công')
      }

      setModalOpen(false)
      setEditing(null)
      fetchStaff()
    } catch (error: any) {
      console.error('Operation failed:', error)
      message.error(error?.response?.data?.message || 'Thao tác thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    Promise.resolve().then(() => fetchStaff())
  }, [query.page, query.limit, query.keyword, query.status, query.sortBy, query.sortOrder, query.isVerified])

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Nhân viên vận hành
          </Title>
          <Text type="secondary">Tài khoản nội bộ quản trị — không trùng với tài khoản freelance / chủ dự án.</Text>
        </div>
      </div>

      <Card>
        <Space wrap style={{ marginBottom: 16 }} className="flex justify-between items-end">
          <AppFilters filters={StaffFilters} onChange={handleGetValueFilter} />
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} className="">
            Thêm nhân viên
          </Button>
        </Space>

        <TableStaff
          loading={isLoading}
          page={query.page}
          pageSize={query.limit}
          total={query?.pagination?.total || 0}
          staffList={staffList}
          onPageChange={handleChangePageSizeTable}
          onDelete={() => {}}
          onView={handleViewDetail}
        />
      </Card>

      <Modal
        title={editing ? 'Sửa nhân viên' : 'Thêm nhân viên'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        onOk={handleModalOk}
        confirmLoading={isSubmitting}
        okText={editing ? 'Cập nhật' : 'Thêm'}
        destroyOnHidden
        width={600}
      >
        <Form<FormStaff>
          form={form}
          layout="vertical"
          initialValues={{ role: 'staff', status: 'active', gender: 'male' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Nhập họ tên' }]}>
                <Input placeholder="Nguyễn Văn A" maxLength={120} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email nội bộ"
                name="email"
                rules={[
                  { required: true, message: 'Nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input placeholder="email@internal.com" maxLength={120} disabled={!!editing} />
              </Form.Item>
            </Col>
          </Row>

          {!editing && (
            <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Nhập mật khẩu' }]}>
              <Input.Password placeholder="••••••••" />
            </Form.Item>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Nhập số điện thoại' }]}>
                <Input placeholder="09xxxxxxxx" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngày sinh" name="birthday" rules={[{ required: true, message: 'Chọn ngày sinh' }]}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: 'Chọn giới tính' }]}>
                <Select
                  options={[
                    { label: 'Nam', value: 'male' },
                    { label: 'Nữ', value: 'female' }
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

          <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Nhập địa chỉ' }]}>
            <Input.TextArea rows={2} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" />
          </Form.Item>

          <Form.Item name="role" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}

export default StaffPage
