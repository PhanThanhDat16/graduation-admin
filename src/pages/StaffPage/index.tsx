import { useEffect, useState } from 'react'
import { Button, Card, Descriptions, Form, Input, Modal, Space, Switch, Tag, Typography, message } from 'antd'
import dayjs from 'dayjs'
import { PlusOutlined, UserOutlined } from '@ant-design/icons'
import { DetailDrawer } from '@/components/DetailDrawer'
import { userService } from '@/apis/userService'
import type { StaffQuery, UserResponse } from '@/types/user'
import type { FilterConfig } from '@/components/common/AppFilters'
import TableStaff from './Table'
import AppFilters from '@/components/common/AppFilters'

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
  }
]

type FormStaff = {
  fullName: string
  email: string
  status: 'active' | 'disabled'
}

const StaffPage = () => {
  const [detail, setDetail] = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<UserResponse | null>(null)
  const [form] = Form.useForm<FormStaff>()

  const [query, setQuery] = useState<StaffQuery>({
    role: 'staff',
    keyword: '',
    status: '',
    page: 1,
    limit: 10
  })
  const [staffList, setStaffList] = useState<UserResponse[]>([])

  const handleGetValueFilter = (values: Record<string, any>) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      keyword: values.keyword || '',
      status: values.status || ''
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
    setDetail(record)
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

  const openEdit = (record: UserResponse) => {
    setEditing(record)
    form.setFieldsValue({
      fullName: record.fullName,
      email: record.email,
      status: record.status || 'active'
    })
    setModalOpen(true)
  }

  const handleModalOk = async () => {
    try {
      // Logic for create/update would go here when API is ready
      // const values = await form.validateFields()
      message.info('Tính năng Thêm/Sửa đang được phát triển.')
      setModalOpen(false)
      setEditing(null)
    } catch (error) {
      console.error('Validation failed:', error)
    }
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

  useEffect(() => {
    Promise.resolve().then(() => fetchStaff())
  }, [query.page, query.limit, query.keyword, query.status])

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Nhân viên vận hành
          </Title>
          <Text type="secondary">Tài khoản nội bộ quản trị — không trùng với tài khoản freelance / chủ dự án.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Thêm nhân viên
        </Button>
      </div>

      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <AppFilters filters={StaffFilters} onChange={handleGetValueFilter} />
        </Space>

        <TableStaff
          loading={isLoading}
          page={query.page}
          pageSize={query.limit}
          total={query?.pagination?.total || 0}
          staffList={staffList}
          onPageChange={handleChangePageSizeTable}
          onDelete={() => {}}
          onEdit={(id) => {
            const record = staffList.find((s) => s._id === id)
            if (record) openEdit(record)
          }}
          onView={handleViewDetail}
        />
      </Card>

      <DetailDrawer
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `Nhân viên: ${detail.fullName}` : 'Chi tiết'}
        width={520}
        extra={
          detail ? (
            <Button icon={<UserOutlined />} onClick={() => detail && openEdit(detail)}>
              Sửa
            </Button>
          ) : undefined
        }
      >
        {detail && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              {detail.avatarUrl ? (
                <img
                  src={detail.avatarUrl}
                  alt={detail.fullName}
                  style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: 100,
                    height: 100,
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

            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Mã user">{detail._id}</Descriptions.Item>
              <Descriptions.Item label="Họ tên">{detail.fullName}</Descriptions.Item>
              <Descriptions.Item label="Email">{detail.email}</Descriptions.Item>
              <Descriptions.Item label="Vai trò">
                <Tag color={detail.role === 'admin' ? 'red' : 'blue'}>
                  {detail.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{detail.phone || 'Chưa cập nhật'}</Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {detail.gender === 'male' ? 'Nam' : detail.gender === 'female' ? 'Nữ' : 'Khác'}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {detail.status === 'active' ? <Tag color="success">Hoạt động</Tag> : <Tag color="error">Vô hiệu</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Tham gia">
                {dayjs(detail.createdAt).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
            </Descriptions>
          </Space>
        )}
      </DetailDrawer>

      <Modal
        title={editing ? 'Sửa nhân viên' : 'Thêm nhân viên'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        onOk={handleModalOk}
        okText={editing ? 'Cập nhật' : 'Thêm'}
        destroyOnHidden
        width={480}
      >
        <Form<FormStaff> form={form} layout="vertical" requiredMark="optional">
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
          <Form.Item
            label="Trạng thái"
            name="status"
            valuePropName="checked"
            getValueProps={(v) => ({ checked: v === 'active' })}
          >
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Vô hiệu" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}

export default StaffPage
