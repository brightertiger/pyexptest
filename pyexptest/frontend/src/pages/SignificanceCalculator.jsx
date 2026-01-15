import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

function SignificanceCalculator() {
  const [testType, setTestType] = useState('binary')
  const [formData, setFormData] = useState({
    control_visitors: 10000,
    control_conversions: 500,
    variant_visitors: 10000,
    variant_conversions: 550,
    confidence: 95,
    control_mean: 50,
    control_std: 25,
    variant_mean: 52.5,
    variant_std: 25,
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const endpoint = testType === 'binary' 
      ? '/api/conversion/analyze'
      : '/api/magnitude/analyze'
    
    const payload = testType === 'binary'
      ? {
          control_visitors: formData.control_visitors,
          control_conversions: formData.control_conversions,
          variant_visitors: formData.variant_visitors,
          variant_conversions: formData.variant_conversions,
          confidence: formData.confidence,
        }
      : {
          control_visitors: formData.control_visitors,
          control_mean: formData.control_mean,
          control_std: formData.control_std,
          variant_visitors: formData.variant_visitors,
          variant_mean: formData.variant_mean,
          variant_std: formData.variant_std,
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
        throw new Error(data.detail || 'Analysis failed')
      }
      
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const controlRate = formData.control_conversions / formData.control_visitors
  const variantRate = formData.variant_conversions / formData.variant_visitors

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Analyze Results</h1>
        <p className="page-description">
          Check if your A/B test has a statistically significant winner.
        </p>
      </div>

      <div className="card">
        <div className="card-title">Test Type</div>
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
            Revenue / AOV
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {testType === 'binary' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="card">
              <div className="card-title">Control</div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Visitors</label>
                <input
                  type="number"
                  name="control_visitors"
                  className="form-input"
                  value={formData.control_visitors}
                  onChange={handleChange}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Conversions</label>
                <input
                  type="number"
                  name="control_conversions"
                  className="form-input"
                  value={formData.control_conversions}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div style={{ marginTop: '12px', padding: '8px 12px', background: 'var(--bg-hover)', borderRadius: 'var(--radius)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Rate: </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{(controlRate * 100).toFixed(2)}%</span>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Variant</div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Visitors</label>
                <input
                  type="number"
                  name="variant_visitors"
                  className="form-input"
                  value={formData.variant_visitors}
                  onChange={handleChange}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Conversions</label>
                <input
                  type="number"
                  name="variant_conversions"
                  className="form-input"
                  value={formData.variant_conversions}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div style={{ marginTop: '12px', padding: '8px 12px', background: 'var(--bg-hover)', borderRadius: 'var(--radius)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Rate: </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{(variantRate * 100).toFixed(2)}%</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="card">
              <div className="card-title">Control</div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Sample Size</label>
                <input
                  type="number"
                  name="control_visitors"
                  className="form-input"
                  value={formData.control_visitors}
                  onChange={handleChange}
                  min="2"
                />
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Mean</label>
                <input
                  type="number"
                  name="control_mean"
                  className="form-input"
                  value={formData.control_mean}
                  onChange={handleChange}
                  step="any"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Std Dev</label>
                <input
                  type="number"
                  name="control_std"
                  className="form-input"
                  value={formData.control_std}
                  onChange={handleChange}
                  step="any"
                  min="0"
                />
              </div>
            </div>

            <div className="card">
              <div className="card-title">Variant</div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Sample Size</label>
                <input
                  type="number"
                  name="variant_visitors"
                  className="form-input"
                  value={formData.variant_visitors}
                  onChange={handleChange}
                  min="2"
                />
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Mean</label>
                <input
                  type="number"
                  name="variant_mean"
                  className="form-input"
                  value={formData.variant_mean}
                  onChange={handleChange}
                  step="any"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Std Dev</label>
                <input
                  type="number"
                  name="variant_std"
                  className="form-input"
                  value={formData.variant_std}
                  onChange={handleChange}
                  step="any"
                  min="0"
                />
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="form-group" style={{ maxWidth: '200px' }}>
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
          <div style={{ marginTop: '16px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {result && (
        <div className="results-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span className={`tag ${result.is_significant ? (result.winner === 'variant' ? 'tag-green' : 'tag-red') : 'tag-yellow'}`}>
              {result.is_significant 
                ? (result.winner === 'variant' ? '✓ Variant Wins' : '✓ Control Wins')
                : '○ Not Significant'
              }
            </span>
            <span style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              {result.lift_percent > 0 ? '+' : ''}{result.lift_percent.toFixed(1)}%
            </span>
          </div>

          <div className="result-grid">
            <div className="result-item">
              <div className="result-label">Control</div>
              <div className="result-value">
                {testType === 'binary' 
                  ? `${(result.control_rate * 100).toFixed(2)}%`
                  : `$${result.control_mean.toFixed(2)}`
                }
              </div>
            </div>
            <div className="result-item">
              <div className="result-label">Variant</div>
              <div className="result-value">
                {testType === 'binary' 
                  ? `${(result.variant_rate * 100).toFixed(2)}%`
                  : `$${result.variant_mean.toFixed(2)}`
                }
              </div>
            </div>
            <div className="result-item">
              <div className="result-label">P-Value</div>
              <div className="result-value">{result.p_value < 0.0001 ? '<0.0001' : result.p_value.toFixed(4)}</div>
            </div>
            <div className="result-item">
              <div className="result-label">Confidence</div>
              <div className="result-value">{result.confidence}%</div>
            </div>
          </div>

          <div className={`callout ${result.is_significant ? 'callout-success' : 'callout-warning'}`} style={{ marginTop: '16px' }}>
            <div className="callout-text markdown-content">
              <ReactMarkdown>{result.recommendation}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SignificanceCalculator
