import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Space, Typography } from 'antd'
import { WALLET_PAGE } from '@/constants'
import { walletService } from '@/apis/walletService'
import type { WalletQuery, WalletResponse } from '@/types/wallet'
import TableWallets from './Table'
import type { FilterConfig } from '@/components/common/AppFilters'
import AppFilters from '@/components/common/AppFilters'

const { Title, Text } = Typography

const WalletFilters: FilterConfig[] = [
  {
    type: 'input',
    name: 'userId',
    placeholder: 'Tìm kiếm id người dùng...',
    label: 'Tìm kiếm'
  }
]

const WalletPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState<WalletQuery>({
    userId: '',
    page: 1,
    limit: 10
  })
  const [wallets, setWallets] = useState<WalletResponse[]>([])

  const handleGetValueFilter = (values: Record<string, any>) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      userId: values.userId || ''
    }))
  }

  const handleChangePageSizeTable = (newPage: number, newSize: number) => {
    setQuery((prev) => ({
      ...prev,
      page: newPage,
      limit: newSize
    }))
  }

  const handleViewDetail = (record: WalletResponse) => {
    navigate(`${WALLET_PAGE}/${record.userId._id}`)
  }

  const fetchWallets = async () => {
    try {
      setIsLoading(true)
      const res = await walletService.getAllUserWallets(query)
      const payload = res.data || {
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
      }
      setWallets(payload.data || [])
      if (payload.pagination) {
        setQuery((prev) => ({
          ...prev,
          pagination: payload.pagination
        }))
      }
    } catch (error) {
      console.error('Failed to fetch wallets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWallets()
  }, [query.page, query.limit, query.userId])

  return (
    <Space vertical size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Ví người dùng
        </Title>
        <Text type="secondary">
          Tra cứu giao dịch nạp/rút ví cá nhân của người dùng (số dư ví là dữ liệu nhạy cảm, chỉ dành cho quản trị
          viên).
        </Text>
      </div>

      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <AppFilters filters={WalletFilters} onChange={handleGetValueFilter} />
        </Space>

        <TableWallets
          loading={isLoading}
          page={query.page}
          pageSize={query.limit}
          total={query?.pagination?.total || 0}
          wallets={wallets}
          onPageChange={handleChangePageSizeTable}
          onDelete={() => {}}
          onView={handleViewDetail}
        />
      </Card>
    </Space>
  )
}

export default WalletPage
