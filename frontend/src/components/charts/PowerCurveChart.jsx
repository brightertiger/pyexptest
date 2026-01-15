import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts'

function PowerCurveChart({
  requiredN,
  power,
  mde,
  baseline
}) {
  const data = useMemo(() => {
    if (!requiredN || requiredN <= 0) return null
    
    const points = []
    const maxN = requiredN * 2
    const step = Math.max(1, Math.floor(maxN / 50))
    
    for (let n = Math.floor(requiredN * 0.2); n <= maxN; n += step) {
      const achievedPower = Math.min(99, 50 + 50 * Math.tanh((n - requiredN * 0.5) / (requiredN * 0.3)))
      points.push({
        n,
        power: achievedPower
      })
    }
    
    return points
  }, [requiredN])

  if (!data) return null

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">Sample Size: {label.toLocaleString()}</p>
          <p className="tooltip-value">Power: {payload[0].value.toFixed(1)}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="power-curve-container">
      <div className="chart-title">Statistical Power vs Sample Size</div>
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e8deee" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#e8deee" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="n" 
            tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
            tick={{ fontSize: 10, fill: '#9b9b9b' }}
            axisLine={{ stroke: 'rgba(55, 53, 47, 0.09)' }}
          />
          <YAxis 
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 10, fill: '#9b9b9b' }}
            axisLine={{ stroke: 'rgba(55, 53, 47, 0.09)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={power} 
            stroke="#0f7b0f" 
            strokeDasharray="4 4"
          />
          <ReferenceLine 
            x={requiredN} 
            stroke="#2d6d9a" 
            strokeDasharray="4 4"
          />
          <Area 
            type="monotone" 
            dataKey="power" 
            fill="url(#powerGradient)" 
            stroke="none"
          />
          <Line 
            type="monotone" 
            dataKey="power" 
            stroke="#6940a5" 
            strokeWidth={2.5}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="chart-legend">
        <span className="legend-item">
          <span className="legend-line solid purple"></span>
          Power curve
        </span>
        <span className="legend-item">
          <span className="legend-line dashed green"></span>
          Target power ({power}%)
        </span>
        <span className="legend-item">
          <span className="legend-line dashed blue"></span>
          Required N ({requiredN.toLocaleString()})
        </span>
      </div>
    </div>
  )
}

export default PowerCurveChart
