import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import { format } from 'date-fns'

const formatDateTick = (d) => {
  try {
    return format(new Date(d), 'MMM d')
  } catch {
    return d
  }
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E7E0D3',
        borderRadius: 10,
        padding: '10px 14px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
        fontSize: 13
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{formatDateTick(label)}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.name}: Rs. {Number(p.value).toLocaleString()}
        </div>
      ))}
    </div>
  )
}

const TrendChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B4332" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#1B4332" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4A017" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#D4A017" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#EFE9DC" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDateTick}
          tick={{ fontSize: 12, fill: '#7A6F63' }}
          axisLine={{ stroke: '#E7E0D3' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#7A6F63' }}
          axisLine={false}
          tickLine={false}
          width={70}
          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 13 }} />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#1B4332"
          strokeWidth={2}
          fill="url(#revenueGradient)"
        />
        <Area
          type="monotone"
          dataKey="netProfitLoss"
          name="Net Profit/Loss"
          stroke="#D4A017"
          strokeWidth={2}
          fill="url(#profitGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default TrendChart
