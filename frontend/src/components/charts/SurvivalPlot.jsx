import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts'

function SurvivalPlot({
  controlMedian,
  treatmentMedian,
  controlEvents,
  treatmentEvents,
  hazardRatio
}) {
  const data = useMemo(() => {
    if (!controlMedian || !treatmentMedian) return null
    
    const points = []
    const maxTime = Math.max(controlMedian, treatmentMedian) * 2
    const step = maxTime / 50
    
    for (let t = 0; t <= maxTime; t += step) {
      const controlLambda = Math.log(2) / controlMedian
      const treatmentLambda = Math.log(2) / treatmentMedian
      
      const controlSurvival = Math.exp(-controlLambda * t) * 100
      const treatmentSurvival = Math.exp(-treatmentLambda * t) * 100
      
      points.push({
        time: t,
        control: Math.max(0, controlSurvival),
        treatment: Math.max(0, treatmentSurvival)
      })
    }
    
    return points
  }, [controlMedian, treatmentMedian])

  if (!data) return null

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">Time: {label.toFixed(1)}</p>
          {payload.map((p, i) => (
            <p key={i} className="tooltip-value" style={{ color: p.color }}>
              {p.name}: {p.value.toFixed(1)}%
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="survival-plot-container">
      <div className="chart-title">Kaplan-Meier Survival Estimate</div>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="controlSurvGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d3e5ef" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#d3e5ef" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="treatmentSurvGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#dbeddb" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#dbeddb" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            tickFormatter={(v) => v.toFixed(0)}
            tick={{ fontSize: 10, fill: '#9b9b9b' }}
            axisLine={{ stroke: 'rgba(55, 53, 47, 0.09)' }}
          />
          <YAxis 
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 10, fill: '#9b9b9b' }}
            axisLine={{ stroke: 'rgba(55, 53, 47, 0.09)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={50} 
            stroke="#9b9b9b" 
            strokeDasharray="4 4"
            strokeOpacity={0.5}
          />
          <ReferenceLine 
            x={controlMedian} 
            stroke="#2d6d9a" 
            strokeDasharray="4 4"
            strokeOpacity={0.6}
          />
          <ReferenceLine 
            x={treatmentMedian} 
            stroke="#0f7b0f" 
            strokeDasharray="4 4"
            strokeOpacity={0.6}
          />
          <Area 
            type="stepAfter" 
            dataKey="control" 
            fill="url(#controlSurvGradient)" 
            stroke="none"
          />
          <Area 
            type="stepAfter" 
            dataKey="treatment" 
            fill="url(#treatmentSurvGradient)" 
            stroke="none"
          />
          <Line 
            type="stepAfter" 
            dataKey="control" 
            stroke="#2d6d9a" 
            strokeWidth={2.5}
            dot={false}
            name="Control"
          />
          <Line 
            type="stepAfter" 
            dataKey="treatment" 
            stroke="#0f7b0f" 
            strokeWidth={2.5}
            dot={false}
            name="Treatment"
          />
        </ComposedChart>
      </ResponsiveContainer>
      
      <div className="survival-metrics">
        <div className="survival-metric">
          <span className="metric-dot control"></span>
          <span className="metric-label">Control Median:</span>
          <span className="metric-value">{controlMedian?.toFixed(1) || 'N/A'}</span>
        </div>
        <div className="survival-metric">
          <span className="metric-dot treatment"></span>
          <span className="metric-label">Treatment Median:</span>
          <span className="metric-value">{treatmentMedian?.toFixed(1) || 'N/A'}</span>
        </div>
        <div className="survival-metric">
          <span className="metric-label">Hazard Ratio:</span>
          <span className="metric-value">{hazardRatio?.toFixed(3) || 'N/A'}</span>
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
          <span className="legend-line dashed"></span>
          50% survival (median)
        </span>
      </div>
    </div>
  )
}

export default SurvivalPlot
