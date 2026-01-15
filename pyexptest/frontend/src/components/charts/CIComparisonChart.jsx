import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'

function CIComparisonChart({ 
  controlValue, 
  variantValue, 
  controlCI = null, 
  variantCI = null,
  label = 'Conversion Rate',
  formatValue = (v) => `${(v * 100).toFixed(2)}%`,
  isConversion = true
}) {
  if (controlValue === undefined || variantValue === undefined) return null

  const data = [
    {
      name: 'Control',
      value: controlValue,
      ciLow: controlCI ? controlCI[0] : controlValue,
      ciHigh: controlCI ? controlCI[1] : controlValue,
    },
    {
      name: 'Variant',
      value: variantValue,
      ciLow: variantCI ? variantCI[0] : variantValue,
      ciHigh: variantCI ? variantCI[1] : variantValue,
    }
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{d.name}</p>
          <p className="tooltip-value">{formatValue(d.value)}</p>
          {d.ciLow !== d.value && (
            <p className="tooltip-ci">
              CI: [{formatValue(d.ciLow)}, {formatValue(d.ciHigh)}]
            </p>
          )}
        </div>
      )
    }
    return null
  }

  const maxValue = Math.max(
    controlCI ? controlCI[1] : controlValue,
    variantCI ? variantCI[1] : variantValue
  ) * 1.15

  return (
    <div className="ci-comparison-container">
      <div className="chart-title">{label} Comparison</div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart 
          data={data} 
          layout="vertical" 
          margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
        >
          <XAxis 
            type="number" 
            domain={[0, maxValue]}
            tickFormatter={(v) => isConversion ? `${(v * 100).toFixed(1)}%` : v.toFixed(1)}
            tick={{ fontSize: 11, fill: '#9b9b9b' }}
            axisLine={{ stroke: 'rgba(55, 53, 47, 0.09)' }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            tick={{ fontSize: 12, fill: '#6b6b6b' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            x={controlValue} 
            stroke="#2d6d9a" 
            strokeDasharray="4 4" 
            strokeOpacity={0.6}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
            <Cell fill="#d3e5ef" stroke="#2d6d9a" strokeWidth={1} />
            <Cell fill="#dbeddb" stroke="#0f7b0f" strokeWidth={1} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="chart-legend">
        <span className="legend-item">
          <span className="legend-line dashed"></span>
          Control baseline
        </span>
      </div>
    </div>
  )
}

export default CIComparisonChart
