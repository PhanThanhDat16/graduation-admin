import axiosInstance from '@/utils/axiosInstance'

export type DashboardGranularity = 'day' | 'month' | 'year'

export interface TimeseriesBucket {
  label: string
  sortKey: string
  contracts: number
  completedProjects: number
  disputes: number
  revenueContractVnd: number
  revenueWalletVnd: number
}

export interface DashboardSummary {
  totalContracts: number
  completedProjects: number
  disputeCases: number
  revenueContractVnd: number
  revenueWalletVnd: number
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
      { period: b.label, value: b.contracts, type: 'Hợp đồng mới' },
      { period: b.label, value: b.completedProjects, type: 'Dự án hoàn thành' },
      { period: b.label, value: b.disputes, type: 'Tranh chấp' }
    )
  }
  return rows
}

/** Convert buckets → Column chart data. */
// export function toRevenueColumnData(buckets: TimeseriesBucket[]) {
//   return buckets.map((b) => ({
//     period: b.label,
//     revenue: b.revenueVnd
//   }))
// }

export function toRevenueColumnData(buckets: TimeseriesBucket[]) {
  const columns: { period: string; type: string; value: number }[] = []
  for (const b of buckets) {
    columns.push(
      { period: b.label, type: 'Doanh thu hợp đồng', value: b.revenueContractVnd },
      { period: b.label, type: 'Doanh thu phí rút tiền', value: b.revenueWalletVnd },
      { period: b.label, type: 'Tổng doanh thu', value: b.revenueContractVnd + b.revenueWalletVnd }
    )
  }
  return columns
}
