import { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import { DetailDrawer } from '@/components/DetailDrawer'
import { MOCK_STAFF, STAFF_ROLE_LABEL, type MockStaff, type StaffRole } from '@/mock/staff.mock'

const { Title, Text } = Typography

const ROLE_COLOR: Record<StaffRole, string> = {
  super_admin: 'red',
  moderator: 'blue',
  support: 'green'
}

type FormStaff = {
  employeeCode: string
  fullName: string
  email: string
  role: StaffRole
  active: boolean
}

const StaffPage = () => {
  const [list, setList] = useState<MockStaff[]>(() => [...MOCK_STAFF])
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<StaffRole | 'all'>('all')

  const [detail, setDetail] = useState<MockStaff | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<MockStaff | null>(null)
  const [form] = Form.useForm<FormStaff>()

  const filtered = useMemo(() => {
    return list.filter((s) => {
      const q = search.toLowerCase()
      const matchText =
        !search.trim() ||
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.employeeCode.toLowerCase().includes(q)
      const matchRole = role === 'all' || s.role === role
      return matchText && matchRole
    })
  }, [list, search, role])

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({
      employeeCode: '',
      fullName: '',
      email: '',
      role: 'support',
      active: true
    })
    setModalOpen(true)
  }

  const openEdit = useCallback(
    (record: MockStaff) => {
      setEditing(record)
      form.setFieldsValue({
        employeeCode: record.employeeCode,
        fullName: record.fullName,
        email: record.email,
        role: record.role,
        active: record.active
      })
      setModalOpen(true)
    },
    [form]
  )

  const handleModalOk = async () => {
    try {
      const v = await form.validateFields()
      const codeTrim = v.employeeCode.trim()
      const dup = list.some((s) => s.employeeCode.toLowerCase() === codeTrim.toLowerCase() && s.id !== editing?.id)
      if (dup) {
        message.error('Mã nhân viên đã tồn tại.')
        return
      }
      if (editing) {
        setList((prev) =>
          prev.map((s) =>
            s.id === editing.id
              ? {
                  ...s,
                  employeeCode: codeTrim,
                  fullName: v.fullName.trim(),
                  email: v.email.trim(),
                  role: v.role,
                  active: v.active
                }
              : s
          )
        )
        message.success('Đã cập nhật nhân viên (mock).')
      } else {
        const row: MockStaff = {
          id: uuidv4(),
          employeeCode: codeTrim,
          fullName: v.fullName.trim(),
          email: v.email.trim(),
          role: v.role,
          active: v.active,
          lastLoginAt: null
        }
        setList((prev) => [row, ...prev])
        message.success('Đã thêm nhân viên (mock).')
      }
      setModalOpen(false)
      setEditing(null)
    } catch {
      /* validate */
    }
  }

  const handleDelete = useCallback((id: string) => {
    setList((prev) => prev.filter((s) => s.id !== id))
    setDetail((d) => (d?.id === id ? null : d))
    message.success('Đã xóa nhân viên (mock).')
  }, [])

  const columns: ColumnsType<MockStaff> = useMemo(
    () => [
      { title: 'Mã NV', dataIndex: 'employeeCode', key: 'ec', width: 120 },
      { title: 'Họ tên', dataIndex: 'fullName', key: 'name' },
      { title: 'Email nội bộ', dataIndex: 'email', key: 'em', ellipsis: true },
      {
        title: 'Vai trò',
        dataIndex: 'role',
        key: 'role',
        width: 200,
        render: (r: StaffRole) => <Tag color={ROLE_COLOR[r]}>{STAFF_ROLE_LABEL[r]}</Tag>
      },
      {
        title: 'Trạng thái',
        dataIndex: 'active',
        key: 'act',
        width: 120,
        render: (a: boolean) => (a ? <Tag color="success">Đang làm</Tag> : <Tag>Nghỉ / khóa</Tag>)
      },
      {
        title: 'Đăng nhập gần nhất',
        dataIndex: 'lastLoginAt',
        key: 'll',
        width: 170,
        render: (iso: string | null) => (iso ? dayjs(iso).format('DD/MM/YYYY HH:mm') : <Text type="secondary">—</Text>)
      },
      {
        title: 'Thao tác',
        key: 'actions',
        fixed: 'right',
        width: 220,
        render: (_: unknown, record: MockStaff) => (
          <Space size={0} wrap>
            <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => setDetail(record)}>
              Chi tiết
            </Button>
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
              Sửa
            </Button>
            <Popconfirm
              title="Xóa nhân viên này?"
              description="Hành động chỉ áp dụng trên dữ liệu mock."
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        )
      }
    ],
    [openEdit, handleDelete]
  )

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Nhân viên vận hành
        </Title>
        <Text type="secondary">Tài khoản nội bộ quản trị — không trùng với tài khoản freelance / chủ dự án.</Text>
      </div>

      <Card>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
          }}
        >
          <Space wrap>
            <Input.Search
              allowClear
              placeholder="Tên, email, mã nhân viên…"
              onSearch={setSearch}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 320 }}
            />
            <Select
              value={role}
              onChange={setRole}
              style={{ width: 220 }}
              options={[
                { label: 'Mọi vai trò', value: 'all' },
                ...(Object.keys(STAFF_ROLE_LABEL) as StaffRole[]).map((k) => ({
                  label: STAFF_ROLE_LABEL[k],
                  value: k
                }))
              ]}
            />
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Thêm nhân viên
          </Button>
        </div>
        <Table rowKey="id" columns={columns} dataSource={filtered} pagination={{ pageSize: 8 }} scroll={{ x: 1100 }} />
      </Card>

      <DetailDrawer
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `Chi tiết: ${detail.fullName}` : 'Chi tiết'}
        extra={
          detail ? (
            <Button icon={<UserOutlined />} onClick={() => detail && openEdit(detail)}>
              Sửa
            </Button>
          ) : undefined
        }
      >
        {detail && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Mã nhân viên">{detail.employeeCode}</Descriptions.Item>
            <Descriptions.Item label="Họ tên">{detail.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{detail.email}</Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              <Tag color={ROLE_COLOR[detail.role]}>{STAFF_ROLE_LABEL[detail.role]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {detail.active ? <Tag color="success">Đang làm</Tag> : <Tag>Nghỉ / khóa</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="Đăng nhập gần nhất">
              {detail.lastLoginAt ? dayjs(detail.lastLoginAt).format('DD/MM/YYYY HH:mm') : '—'}
            </Descriptions.Item>
          </Descriptions>
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
        destroyOnClose
        width={480}
      >
        <Form<FormStaff> form={form} layout="vertical" requiredMark="optional">
          <Form.Item
            label="Mã nhân viên"
            name="employeeCode"
            rules={[{ required: true, message: 'Nhập mã nhân viên' }]}
          >
            <Input maxLength={32} placeholder="VD: NV-ADM-099" />
          </Form.Item>
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
          <Form.Item label="Vai trò" name="role" rules={[{ required: true }]}>
            <Select
              options={(Object.keys(STAFF_ROLE_LABEL) as StaffRole[]).map((k) => ({
                label: STAFF_ROLE_LABEL[k],
                value: k
              }))}
            />
          </Form.Item>
          <Form.Item label="Đang làm việc" name="active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}

export default StaffPage
