import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'

function RateComparisonChart({
  controlRate,
  treatmentRate,
  controlCI = null,
  treatmentCI = null,
  label = 'Event Rate',
  unit = 'per day'
}) {
  if (controlRate === undefined || treatmentRate === undefined) return null

  const data = [
    {
      name: 'Control',
      rate: controlRate,
    },
    {
      name: 'Treatment',
      rate: treatmentRate,
    }
  ]

  const maxRate = Math.max(controlRate, treatmentRate) * 1.3

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{d.name}</p>
          <p className="tooltip-value">{d.rate.toFixed(4)} {unit}</p>
        </div>
      )
    }
    return null
  }

  const percentChange = ((treatmentRate - controlRate) / controlRate * 100).toFixed(1)

  return (
    <div className="rate-comparison-container">
      <div className="chart-title">{label} Comparison</div>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: '#6b6b6b' }}
            axisLine={{ stroke: 'rgba(55, 53, 47, 0.09)' }}
          />
          <YAxis 
            domain={[0, maxRate]}
            tickFormatter={(v) => v.toFixed(2)}
            tick={{ fontSize: 10, fill: '#9b9b9b' }}
            axisLine={{ stroke: 'rgba(55, 53, 47, 0.09)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={controlRate} 
            stroke="#2d6d9a" 
            strokeDasharray="4 4" 
            strokeOpacity={0.6}
          />
          <Bar dataKey="rate" radius={[4, 4, 0, 0]} barSize={60}>
            <Cell fill="#d3e5ef" stroke="#2d6d9a" strokeWidth={1} />
            <Cell fill={treatmentRate < controlRate ? "#dbeddb" : "#ffe2dd"} stroke={treatmentRate < controlRate ? "#0f7b0f" : "#c4554d"} strokeWidth={1} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="rate-change-indicator">
        <span className={`rate-change ${treatmentRate < controlRate ? 'decrease' : 'increase'}`}>
          {treatmentRate < controlRate ? '↓' : '↑'} {Math.abs(parseFloat(percentChange))}%
        </span>
        <span className="rate-change-label">
          {treatmentRate < controlRate ? 'reduction' : 'increase'} in treatment
        </span>
      </div>
    </div>
  )
}

export default RateComparisonChart
