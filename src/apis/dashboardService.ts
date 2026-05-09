import axiosInstance from '@/utils/axiosInstance'

export type DashboardGranularity = 'day' | 'month' | 'year'

export interface TimeseriesBucket {
  label: string
  sortKey: string
  contracts: number
  completedProjects: number
  disputes: number
  revenueVnd: number
}

export interface DashboardSummary {
  totalContracts: number
  completedProjects: number
  disputeCases: number
  revenueVnd: number
}

export interface DashboardData {
  buckets: TimeseriesBucket[]
  summary: DashboardSummary
}

export const dashboardService = {
  getDashboard: async (from: string, to: string, granularity: DashboardGranularity): Promise<DashboardData> => {
    const res = await axiosInstance.get('/dashboard', {
      params: { from, to, granularity }
    })
    return res.data.data
  }
}

/** Convert buckets → Line chart data (long format for @ant-design/plots). */
export function toActivityLineData(buckets: TimeseriesBucket[]) {
  const rows: { period: string; type: string; value: number }[] = []
  for (const b of buckets) {
    rows.push(
      { period: b.label, type: 'Hợp đồng mới', value: b.contracts },
      { period: b.label, type: 'Dự án hoàn thành', value: b.completedProjects },
      { period: b.label, type: 'Tranh chấp', value: b.disputes }
    )
  }
  return rows
}

/** Convert buckets → Column chart data. */
export function toRevenueColumnData(buckets: TimeseriesBucket[]) {
  return buckets.map((b) => ({
    period: b.label,
    revenue: b.revenueVnd
  }))
}
