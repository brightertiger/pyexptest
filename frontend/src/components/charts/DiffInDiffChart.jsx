import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

function DiffInDiffChart({
  controlPre,
  controlPost,
  treatmentPre,
  treatmentPost,
  isConversion = true,
  diffInDiff = null
}) {
  if (controlPre === undefined || controlPost === undefined || 
      treatmentPre === undefined || treatmentPost === undefined) return null

  const data = [
    {
      period: 'Pre-Period',
      control: controlPre,
      treatment: treatmentPre,
      counterfactual: null
    },
    {
      period: 'Post-Period',
      control: controlPost,
      treatment: treatmentPost,
      counterfactual: treatmentPre + (controlPost - controlPre)
    }
  ]

  const formatValue = (v) => {
    if (v === null || v === undefined) return ''
    return isConversion ? `${(v * 100).toFixed(2)}%` : `$${v.toFixed(2)}`
  }

  const allValues = [controlPre, controlPost, treatmentPre, treatmentPost]
  const minVal = Math.min(...allValues) * 0.9
  const maxVal = Math.max(...allValues) * 1.1

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.filter(p => p.value !== null).map((p, i) => (
            <p key={i} className="tooltip-value" style={{ color: p.color }}>
              {p.name}: {formatValue(p.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const controlChange = controlPost - controlPre
  const treatmentChange = treatmentPost - treatmentPre

  return (
    <div className="did-chart-container">
      <div className="chart-title">Parallel Trends Visualization</div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <XAxis 
            dataKey="period" 
            tick={{ fontSize: 12, fill: '#6b6b6b' }}
            axisLine={{ stroke: 'rgba(55, 53, 47, 0.09)' }}
          />
          <YAxis 
            domain={[minVal, maxVal]}
            tickFormatter={(v) => isConversion ? `${(v * 100).toFixed(1)}%` : v.toFixed(0)}
            tick={{ fontSize: 10, fill: '#9b9b9b' }}
            axisLine={{ stroke: 'rgba(55, 53, 47, 0.09)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            x="Post-Period" 
            stroke="rgba(55, 53, 47, 0.09)" 
            strokeDasharray="2 2"
          />
          
          <Line 
            type="linear" 
            dataKey="control" 
            stroke="#2d6d9a" 
            strokeWidth={2.5}
            dot={{ fill: '#2d6d9a', r: 5 }}
            name="Control"
          />
          <Line 
            type="linear" 
            dataKey="treatment" 
            stroke="#0f7b0f" 
            strokeWidth={2.5}
            dot={{ fill: '#0f7b0f', r: 5 }}
            name="Treatment"
          />
          <Line 
            type="linear" 
            dataKey="counterfactual" 
            stroke="#9f6b2c" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#9f6b2c', r: 4 }}
            name="Counterfactual"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="did-explanation">
        <div className="did-arrows">
          <div className="did-arrow control">
            <span className="arrow-label">Control Δ</span>
            <span className="arrow-value">
              {controlChange >= 0 ? '+' : ''}{isConversion ? `${(controlChange * 100).toFixed(2)}pp` : `$${controlChange.toFixed(2)}`}
            </span>
          </div>
          <div className="did-arrow treatment">
            <span className="arrow-label">Treatment Δ</span>
            <span className="arrow-value">
              {treatmentChange >= 0 ? '+' : ''}{isConversion ? `${(treatmentChange * 100).toFixed(2)}pp` : `$${treatmentChange.toFixed(2)}`}
            </span>
          </div>
          {diffInDiff !== null && (
            <div className="did-arrow effect">
              <span className="arrow-label">DiD Effect</span>
              <span className="arrow-value highlight">
                {diffInDiff >= 0 ? '+' : ''}{isConversion ? `${(diffInDiff * 100).toFixed(2)}pp` : `$${diffInDiff.toFixed(2)}`}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="chart-legend">
        <span className="legend-item">
          <span className="legend-color control"></span>
          Control Group
        </span>
        <span className="legend-item">
          <span className="legend-color variant"></span>
          Treatment Group
        </span>
        <span className="legend-item">
          <span className="legend-color counterfactual"></span>
          Counterfactual
        </span>
      </div>
    </div>
  )
}

export default DiffInDiffChart
