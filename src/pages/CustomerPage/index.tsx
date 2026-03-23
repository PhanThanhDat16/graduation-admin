import { useMemo, useState } from 'react'
import { Button, Card, Descriptions, Input, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EyeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { DetailDrawer } from '@/components/DetailDrawer'
import { CUSTOMER_ROLE_LABEL, MOCK_CUSTOMERS, type CustomerRole, type MockCustomer } from '@/mock/customers.mock'

const { Title, Text } = Typography

const ROLE_COLOR: Record<CustomerRole, string> = {
  client: 'blue',
  freelancer: 'green'
}

const CustomerPage = () => {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<CustomerRole | 'all'>('all')
  const [activeOnly, setActiveOnly] = useState<'all' | 'active' | 'inactive'>('all')
  const [detail, setDetail] = useState<MockCustomer | null>(null)

  const filtered = useMemo(() => {
    return MOCK_CUSTOMERS.filter((c) => {
      const q = search.toLowerCase()
      const matchText =
        !search.trim() ||
        c.displayName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
      const matchRole = role === 'all' || c.role === role
      const matchActive =
        activeOnly === 'all' || (activeOnly === 'active' && c.active) || (activeOnly === 'inactive' && !c.active)
      return matchText && matchRole && matchActive
    })
  }, [search, role, activeOnly])

  const columns: ColumnsType<MockCustomer> = useMemo(
    () => [
      { title: 'Mã user', dataIndex: 'code', key: 'code', width: 130 },
      { title: 'Tên hiển thị', dataIndex: 'displayName', key: 'name', ellipsis: true },
      { title: 'Email', dataIndex: 'email', key: 'email', ellipsis: true },
      {
        title: 'Vai trò',
        dataIndex: 'role',
        key: 'role',
        width: 220,
        render: (r: CustomerRole) => <Tag color={ROLE_COLOR[r]}>{CUSTOMER_ROLE_LABEL[r]}</Tag>
      },
      {
        title: 'Trạng thái',
        dataIndex: 'active',
        key: 'act',
        width: 110,
        render: (a: boolean) => (a ? <Tag color="success">Hoạt động</Tag> : <Tag>Vô hiệu</Tag>)
      },
      { title: 'Số dự án (mock)', dataIndex: 'projectsCount', key: 'pc', width: 130 },
      {
        title: 'Tham gia',
        dataIndex: 'joinedAt',
        key: 'j',
        width: 150,
        render: (iso: string) => dayjs(iso).format('DD/MM/YYYY')
      },
      {
        title: 'Thao tác',
        key: 'act',
        fixed: 'right',
        width: 110,
        render: (_: unknown, record: MockCustomer) => (
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => setDetail(record)}>
            Chi tiết
          </Button>
        )
      }
    ],
    []
  )

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Khách hàng &amp; nhà thầu
        </Title>
        <Text type="secondary">Danh sách tài khoản hai phía nền tảng — chủ dự án và freelance (dữ liệu mock).</Text>
      </div>

      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input.Search
            allowClear
            placeholder="Tìm tên, email, mã…"
            onSearch={setSearch}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            value={role}
            onChange={setRole}
            style={{ width: 260 }}
            options={[
              { label: 'Mọi vai trò', value: 'all' },
              { label: CUSTOMER_ROLE_LABEL.client, value: 'client' },
              { label: CUSTOMER_ROLE_LABEL.freelancer, value: 'freelancer' }
            ]}
          />
          <Select
            value={activeOnly}
            onChange={setActiveOnly}
            style={{ width: 180 }}
            options={[
              { label: 'Tất cả', value: 'all' },
              { label: 'Đang hoạt động', value: 'active' },
              { label: 'Vô hiệu', value: 'inactive' }
            ]}
          />
        </Space>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 8, showSizeChanger: true }}
          scroll={{ x: 1020 }}
        />
      </Card>

      <DetailDrawer
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `User: ${detail.code}` : 'Chi tiết'}
        width={520}
      >
        {detail && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Mã user">{detail.code}</Descriptions.Item>
            <Descriptions.Item label="Tên hiển thị">{detail.displayName}</Descriptions.Item>
            <Descriptions.Item label="Email">{detail.email}</Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              <Tag color={ROLE_COLOR[detail.role]}>{CUSTOMER_ROLE_LABEL[detail.role]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {detail.active ? <Tag color="success">Hoạt động</Tag> : <Tag>Vô hiệu</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="Số dự án (mock)">{detail.projectsCount}</Descriptions.Item>
            <Descriptions.Item label="Tham gia">{dayjs(detail.joinedAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
          </Descriptions>
        )}
      </DetailDrawer>
    </Space>
  )
}

export default CustomerPage
