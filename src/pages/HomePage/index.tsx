import { useMemo, useState, type ReactNode, useContext, useEffect, useRef } from 'react'
import { Card, Col, DatePicker, Row, Segmented, Space, Statistic, Typography, message, theme } from 'antd'
import { FileProtectOutlined, CheckCircleOutlined, WarningOutlined, DollarOutlined } from '@ant-design/icons'
import { Line, Column } from '@ant-design/plots'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import 'dayjs/locale/vi'
import {
  buildDashboardMock,
  toActivityLineData,
  toRevenueColumnData,
  type DashboardGranularity
} from '@/mock/homeDashboard.mock'
import { formatVnd } from '@/utils/formatCurrency'
import { ThemeContext } from '@/contexts/ThemeContext'
import { useLocation, useNavigate } from 'react-router-dom'

dayjs.locale('vi')

const { Title, Text } = Typography

function defaultRange(g: DashboardGranularity): [Dayjs, Dayjs] {
  const end = dayjs()
  if (g === 'day') {
    return [end.subtract(13, 'day').startOf('day'), end.endOf('day')]
  }
  if (g === 'month') {
    return [end.subtract(5, 'month').startOf('month'), end.endOf('month')]
  }
  return [end.subtract(4, 'year').startOf('year'), end.endOf('year')]
}
const { useToken } = theme

const HomePage = () => {
  const { token } = useToken()
  const { isDark } = useContext(ThemeContext)
  const [granularity, setGranularity] = useState<DashboardGranularity>('month')
  const [range, setRange] = useState<[Dayjs, Dayjs]>(() => defaultRange('month'))

  const { buckets, summary } = useMemo(() => buildDashboardMock(range, granularity), [range, granularity])

  const activityData = useMemo(() => toActivityLineData(buckets), [buckets])
  const revenueData = useMemo(() => toRevenueColumnData(buckets), [buckets])

  const location = useLocation()
  const navigate = useNavigate()
  const hasShownMessage = useRef(false)

  useEffect(() => {
    if (location.state?.message && !hasShownMessage.current) {
      message.warning(location.state.message)
      hasShownMessage.current = true
      // Clear message from state
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, location.pathname, navigate])

  // Fix layout break on load by triggering resize event
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  const lineConfig = useMemo(
    () => ({
      theme: {
        type: isDark ? 'dark' : 'light'
      },
      data: activityData,
      xField: 'period',
      yField: 'value',
      seriesField: 'type',
      autoFit: true,
      smooth: true,
      height: 320,
      color: ['#1677ff', '#52c41a', '#faad14'],
      legend: { position: 'top' as const },
      yAxis: {
        label: {
          formatter: (v: string) => v
        },
        grid: {
          line: {
            style: {
              stroke: token.colorBorderSecondary,
              lineDash: [4, 4]
            }
          }
        }
      },
      xAxis: {
        label: {
          autoRotate: true,
          fill: token.colorText
        }
      }
    }),
    [activityData, isDark, token.colorText, token.colorBorderSecondary]
  )

  const columnConfig = useMemo(
    () => ({
      theme: {
        type: isDark ? 'dark' : 'light'
      },
      data: revenueData,
      xField: 'period',
      yField: 'revenue',
      height: 300,
      autoFit: true,
      color: '#722ed1',
      columnStyle: {
        radius: [6, 6, 0, 0]
      },
      yAxis: {
        label: {
          formatter: (v: string) => {
            const n = Number(v)
            if (Number.isNaN(n)) return v
            if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
            if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
            if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`
            return v
          }
        },
        grid: {
          line: {
            style: {
              stroke: token.colorBorderSecondary,
              lineDash: [4, 4]
            }
          }
        }
      },
      xAxis: {
        label: {
          autoRotate: true,
          autoHide: true
        }
      }
    }),
    [revenueData, isDark, token.colorBorderSecondary]
  )

  const onGranularityChange = (val: string) => {
    const g = val as DashboardGranularity
    setGranularity(g)
    setRange(defaultRange(g))
  }

  const onRangeChange = (dates: null | [Dayjs | null, Dayjs | null]) => {
    if (dates?.[0] && dates[1]) {
      setRange([dates[0], dates[1]])
    }
  }

  const pickerMode = granularity === 'month' ? 'month' : granularity === 'year' ? 'year' : undefined

  const rangePresets = useMemo(() => {
    const end = dayjs()
    if (granularity === 'day') {
      return [
        { label: '7 ngày', value: [end.subtract(6, 'day'), end] as [Dayjs, Dayjs] },
        { label: '30 ngày', value: [end.subtract(29, 'day'), end] as [Dayjs, Dayjs] },
        {
          label: 'Tháng này',
          value: [end.startOf('month'), end.endOf('month')] as [Dayjs, Dayjs]
        }
      ]
    }
    if (granularity === 'month') {
      return [
        {
          label: '6 tháng gần nhất',
          value: [end.subtract(5, 'month').startOf('month'), end.endOf('month')] as [Dayjs, Dayjs]
        },
        {
          label: 'Năm này',
          value: [end.startOf('year'), end.endOf('year')] as [Dayjs, Dayjs]
        }
      ]
    }
    return [
      {
        label: '5 năm gần nhất',
        value: [end.subtract(4, 'year').startOf('year'), end.endOf('year')] as [Dayjs, Dayjs]
      }
    ]
  }, [granularity])

  return (
    <Space vertical size="large" style={{ width: '100%' }} className="">
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Tổng quan vận hành
        </Title>
        <Text type="secondary">
          Theo dõi hợp đồng, tiến độ dự án, tranh chấp và doanh thu phí dịch vụ (hệ thống trung gian kết nối nhà thầu và
          chủ đầu tư).
        </Text>
      </div>

      <Card size="small">
        <Space wrap align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <Segmented
            value={granularity}
            onChange={onGranularityChange}
            options={[
              { label: 'Theo ngày', value: 'day' },
              { label: 'Theo tháng', value: 'month' },
              { label: 'Theo năm', value: 'year' }
            ]}
          />
          <DatePicker.RangePicker
            value={range}
            onChange={onRangeChange}
            picker={pickerMode}
            format={granularity === 'year' ? 'YYYY' : granularity === 'month' ? 'MM/YYYY' : 'DD/MM/YYYY'}
            presets={rangePresets}
            allowClear={false}
          />
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Hợp đồng (trong kỳ)"
              value={summary.totalContracts}
              prefix={<FileProtectOutlined />}
              styles={{
                content: { color: token.colorPrimary }
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Dự án hoàn thành"
              value={summary.completedProjects}
              prefix={<CheckCircleOutlined />}
              styles={{
                content: { color: token.colorSuccess }
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Vụ tranh chấp phát sinh"
              value={summary.disputeCases}
              prefix={<WarningOutlined />}
              styles={{
                content: { color: token.colorWarning }
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu phí dịch vụ"
              value={summary.revenueVnd}
              formatter={(v): ReactNode => formatVnd(Number(v))}
              prefix={<DollarOutlined />}
              style={{ color: token.colorInfo }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <Card title="Hoạt động theo thời gian" variant="borderless">
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card title="Doanh thu phí dịch vụ (VND)" variant="borderless">
            <Column {...columnConfig} />
          </Card>
        </Col>
      </Row>
    </Space>
  )
}

export default HomePage
