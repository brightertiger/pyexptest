import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

function ConfidenceIntervalCalculator() {
  const [testType, setTestType] = useState('binary')
  const [formData, setFormData] = useState({
    visitors: 1000,
    conversions: 50,
    confidence: 95,
    mean: 50,
    std: 25,
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const endpoint = testType === 'binary' 
      ? '/api/conversion/confidence-interval'
      : '/api/magnitude/confidence-interval'
    
    const payload = testType === 'binary'
      ? {
          visitors: formData.visitors,
          conversions: formData.conversions,
          confidence: formData.confidence,
        }
      : {
          visitors: formData.visitors,
          mean: formData.mean,
          std: formData.std,
          confidence: formData.confidence,
        }
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Calculation failed')
      }
      
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const currentRate = formData.conversions / formData.visitors

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Confidence Interval</h1>
        <p className="page-description">
          Calculate the range where your true metric likely falls.
        </p>
      </div>

      <div className="card">
        <div className="card-title">Metric Type</div>
        <div className="toggle-group">
          <button 
            className={`toggle-option ${testType === 'binary' ? 'active' : ''}`}
            onClick={() => setTestType('binary')}
          >
            Conversion Rate
          </button>
          <button 
            className={`toggle-option ${testType === 'continuous' ? 'active' : ''}`}
            onClick={() => setTestType('continuous')}
          >
            Average Value
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-title">Data</div>
          <div className="form-grid">
            {testType === 'binary' ? (
              <>
                <div className="form-group">
                  <label className="form-label">Total Visitors</label>
                  <input
                    type="number"
                    name="visitors"
                    className="form-input"
                    value={formData.visitors}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Conversions</label>
                  <input
                    type="number"
                    name="conversions"
                    className="form-input"
                    value={formData.conversions}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Sample Size</label>
                  <input
                    type="number"
                    name="visitors"
                    className="form-input"
                    value={formData.visitors}
                    onChange={handleChange}
                    min="2"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mean</label>
                  <input
                    type="number"
                    name="mean"
                    className="form-input"
                    value={formData.mean}
                    onChange={handleChange}
                    step="any"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Standard Deviation</label>
                  <input
                    type="number"
                    name="std"
                    className="form-input"
                    value={formData.std}
                    onChange={handleChange}
                    step="any"
                    min="0"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Confidence Level</label>
              <select
                name="confidence"
                className="form-select"
                value={formData.confidence}
                onChange={handleChange}
              >
                <option value={90}>90%</option>
                <option value={95}>95%</option>
                <option value={99}>99%</option>
              </select>
            </div>
          </div>

          {testType === 'binary' && (
            <div style={{ marginTop: '12px', padding: '8px 12px', background: 'var(--bg-hover)', borderRadius: 'var(--radius)', display: 'inline-block' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Current rate: </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{(currentRate * 100).toFixed(2)}%</span>
            </div>
          )}

          <div style={{ marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Calculating...' : 'Calculate'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {result && (
        <div className="results-card">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              {result.confidence}% Confidence Interval
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <span style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                {testType === 'binary' 
                  ? `${(result.lower * 100).toFixed(2)}%`
                  : `$${result.lower.toFixed(2)}`
                }
              </span>
              <span style={{ color: 'var(--text-muted)' }}>to</span>
              <span style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                {testType === 'binary' 
                  ? `${(result.upper * 100).toFixed(2)}%`
                  : `$${result.upper.toFixed(2)}`
                }
              </span>
            </div>
          </div>

          <div className="ci-bar">
            {(() => {
              const range = testType === 'binary' ? 1 : Math.max(result.upper * 1.5, result.mean * 2)
              const lowerPos = (result.lower / range) * 100
              const upperPos = (result.upper / range) * 100
              const pointPos = ((testType === 'binary' ? result.rate : result.mean) / range) * 100
              
              return (
                <>
                  <div className="ci-bar-fill" style={{ left: `${lowerPos}%`, width: `${upperPos - lowerPos}%` }} />
                  <div className="ci-bar-point" style={{ left: `${pointPos}%` }} />
                </>
              )
            })()}
          </div>

          <div className="result-grid" style={{ marginTop: '24px' }}>
            <div className="result-item">
              <div className="result-label">Observed</div>
              <div className="result-value">
                {testType === 'binary' 
                  ? `${(result.rate * 100).toFixed(2)}%`
                  : `$${result.mean.toFixed(2)}`
                }
              </div>
            </div>
            <div className="result-item">
              <div className="result-label">Margin of Error</div>
              <div className="result-value">
                {testType === 'binary' 
                  ? `±${(result.margin_of_error * 100).toFixed(2)}%`
                  : `±$${result.margin_of_error.toFixed(2)}`
                }
              </div>
            </div>
          </div>

          <div className="callout callout-info" style={{ marginTop: '16px' }}>
            <div className="callout-text">
              {testType === 'binary' ? (
                <>Based on {formData.visitors.toLocaleString()} visitors, we're {result.confidence}% confident the true conversion rate is between {(result.lower * 100).toFixed(2)}% and {(result.upper * 100).toFixed(2)}%.</>
              ) : (
                <>Based on {formData.visitors.toLocaleString()} observations, we're {result.confidence}% confident the true average is between ${result.lower.toFixed(2)} and ${result.upper.toFixed(2)}.</>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConfidenceIntervalCalculator
