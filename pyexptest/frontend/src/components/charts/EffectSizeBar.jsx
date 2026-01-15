import { useMemo } from 'react'

function EffectSizeBar({ 
  baseline, 
  mde, 
  expectedValue = null,
  label = 'Rate',
  formatValue = (v) => `${v.toFixed(2)}%`,
  showExpected = true
}) {
  const data = useMemo(() => {
    if (!baseline || !mde) return null
    const lower = baseline * (1 - mde / 100)
    const upper = baseline * (1 + mde / 100)
    const padding = baseline * 0.4
    const min = Math.max(0, lower - padding)
    const max = upper + padding
    return { lower, upper, min, max, range: max - min }
  }, [baseline, mde])

  if (!data || data.range === 0) return null

  const toPercent = (value) => ((value - data.min) / data.range) * 100

  const grayAreaWidth = toPercent(data.upper) - toPercent(data.lower)
  const grayAreaStart = toPercent(data.lower)

  return (
    <div className="effect-size-container">
      <div className="effect-size-header">
        <span className="effect-size-title">{label} Spectrum</span>
        <div className="effect-size-legend-inline">
          <span className="legend-chip gray-area">Gray Area</span>
          {showExpected && expectedValue !== null && (
            <span className="legend-chip target">Target</span>
          )}
        </div>
      </div>
      
      <div className="effect-size-track">
        <div className="track-background"></div>
        
        <div 
          className="gray-area-fill"
          style={{ 
            left: `${grayAreaStart}%`, 
            width: `${grayAreaWidth}%` 
          }}
        ></div>
        
        <div 
          className="baseline-marker"
          style={{ left: `${toPercent(baseline)}%` }}
        >
          <div className="marker-line"></div>
          <div className="marker-label">
            <span className="marker-value">{formatValue(baseline)}</span>
            <span className="marker-name">Baseline</span>
          </div>
        </div>
        
        <div 
          className="bound-marker lower"
          style={{ left: `${toPercent(data.lower)}%` }}
        >
          <div className="bound-label">
            <span className="bound-value">{formatValue(data.lower)}</span>
            <span className="bound-name">-{mde}%</span>
          </div>
        </div>
        
        <div 
          className="bound-marker upper"
          style={{ left: `${toPercent(data.upper)}%` }}
        >
          <div className="bound-label">
            <span className="bound-value">{formatValue(data.upper)}</span>
            <span className="bound-name">+{mde}%</span>
          </div>
        </div>
        
        {showExpected && expectedValue !== null && (
          <div 
            className="target-marker"
            style={{ left: `${toPercent(expectedValue)}%` }}
          >
            <div className="target-dot"></div>
            <div className="target-label">
              <span className="target-value">{formatValue(expectedValue)}</span>
              <span className="target-name">Target</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EffectSizeBar
