import type { Dayjs } from 'dayjs'

export type DashboardGranularity = 'day' | 'month' | 'year'

export type TimeseriesBucket = {
  label: string
  sortKey: string
  contracts: number
  completedProjects: number
  disputes: number
  revenueVnd: number
}

export type DashboardSummary = {
  totalContracts: number
  completedProjects: number
  disputeCases: number
  revenueVnd: number
}

function fract(n: number): number {
  return n - Math.floor(n)
}

/** Giả lập dữ liệu ổn định theo chỉ số bucket (để chart không nhảy mỗi lần render). */
function noise(seed: number): number {
  return fract(Math.sin(seed * 12.9898 + 78.233) * 43758.5453)
}

function enumerateBuckets(start: Dayjs, end: Dayjs, granularity: DashboardGranularity): Dayjs[] {
  const out: Dayjs[] = []
  if (granularity === 'day') {
    let cursor = start.startOf('day')
    const last = end.startOf('day')
    let guard = 0
    while ((cursor.isBefore(last) || cursor.isSame(last, 'day')) && guard < 120) {
      out.push(cursor)
      cursor = cursor.add(1, 'day')
      guard += 1
    }
  } else if (granularity === 'month') {
    let cursor = start.startOf('month')
    const last = end.startOf('month')
    let guard = 0
    while ((cursor.isBefore(last) || cursor.isSame(last, 'month')) && guard < 36) {
      out.push(cursor)
      cursor = cursor.add(1, 'month')
      guard += 1
    }
  } else {
    let cursor = start.startOf('year')
    const last = end.startOf('year')
    let guard = 0
    while ((cursor.isBefore(last) || cursor.isSame(last, 'year')) && guard < 15) {
      out.push(cursor)
      cursor = cursor.add(1, 'year')
      guard += 1
    }
  }
  return out
}

function formatLabel(d: Dayjs, granularity: DashboardGranularity): { label: string; sortKey: string } {
  if (granularity === 'day') {
    return { label: d.format('DD/MM'), sortKey: d.format('YYYY-MM-DD') }
  }
  if (granularity === 'month') {
    return { label: d.format('MM/YYYY'), sortKey: d.format('YYYY-MM') }
  }
  return { label: d.format('YYYY'), sortKey: d.format('YYYY') }
}

/**
 * Mock dashboard: nền tảng trung gian — hợp đồng, dự án hoàn thành, tranh chấp, doanh thu phí dịch vụ.
 */
export function buildDashboardMock(
  range: [Dayjs, Dayjs],
  granularity: DashboardGranularity
): { buckets: TimeseriesBucket[]; summary: DashboardSummary } {
  const bucketsRaw = enumerateBuckets(range[0], range[1], granularity)
  const buckets: TimeseriesBucket[] = bucketsRaw.map((d, i) => {
    const { label, sortKey } = formatLabel(d, granularity)
    const n = noise(i + sortKey.charCodeAt(0))
    const n2 = noise(i * 7 + 3)
    const contracts = Math.max(3, Math.round(8 + n * 42 + (granularity === 'year' ? 20 : 0)))
    const completedProjects = Math.max(1, Math.min(contracts - 1, Math.round(contracts * (0.45 + n2 * 0.35))))
    const disputes = Math.min(12, Math.round(n * 9 * (granularity === 'day' ? 0.35 : 1)))
    const revenueVnd = Math.round(contracts * (180_000 + n * 920_000) + completedProjects * 45_000 + disputes * 120_000)
    return {
      label,
      sortKey,
      contracts,
      completedProjects,
      disputes,
      revenueVnd
    }
  })

  const summary: DashboardSummary = buckets.reduce(
    (acc, b) => ({
      totalContracts: acc.totalContracts + b.contracts,
      completedProjects: acc.completedProjects + b.completedProjects,
      disputeCases: acc.disputeCases + b.disputes,
      revenueVnd: acc.revenueVnd + b.revenueVnd
    }),
    {
      totalContracts: 0,
      completedProjects: 0,
      disputeCases: 0,
      revenueVnd: 0
    }
  )

  return { buckets, summary }
}

/** Dữ liệu dạng dài cho Line chart (@ant-design/plots). */
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

export function toRevenueColumnData(buckets: TimeseriesBucket[]) {
  return buckets.map((b) => ({
    period: b.label,
    revenue: b.revenueVnd
  }))
}
