import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const COLORS = ['#6B0F0F', '#1B4332', '#D4A017', '#8A7F72']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null
  const p = payload[0]
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E7E0D3',
        borderRadius: 10,
        padding: '8px 14px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
        fontSize: 13
      }}
    >
      <strong>{p.name}</strong>: Rs. {Number(p.value).toLocaleString()}
    </div>
  )
}

const ExpenseBreakdownChart = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  if (total === 0) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#7A6F63', fontSize: 13 }}>
        No expenses recorded yet for this period.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={62}
          outerRadius={95}
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12.5 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default ExpenseBreakdownChart
