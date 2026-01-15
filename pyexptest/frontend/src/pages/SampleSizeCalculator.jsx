import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

function SampleSizeCalculator() {
  const [testType, setTestType] = useState('binary')
  const [formData, setFormData] = useState({
    current_rate: 5,
    lift_percent: 10,
    confidence: 95,
    power: 80,
    daily_visitors: '',
    current_mean: 50,
    current_std: 25,
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : parseFloat(value)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const endpoint = testType === 'binary' 
      ? '/api/conversion/sample-size'
      : '/api/magnitude/sample-size'
    
    const payload = testType === 'binary'
      ? {
          current_rate: formData.current_rate,
          lift_percent: formData.lift_percent,
          confidence: formData.confidence,
          power: formData.power,
          daily_visitors: formData.daily_visitors || null,
        }
      : {
          current_mean: formData.current_mean,
          current_std: formData.current_std,
          lift_percent: formData.lift_percent,
          confidence: formData.confidence,
          power: formData.power,
          daily_visitors: formData.daily_visitors || null,
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

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Sample Size Calculator</h1>
        <p className="page-description">
          Calculate how many visitors you need for a reliable A/B test.
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
        <div className="card">
          <div className="card-title">Parameters</div>
          <div className="form-grid">
            {testType === 'binary' ? (
              <div className="form-group">
                <label className="form-label">Current Conversion Rate (%)</label>
                <input
                  type="number"
                  name="current_rate"
                  className="form-input"
                  value={formData.current_rate}
                  onChange={handleChange}
                  step="any"
                  min="0.01"
                  max="99"
                  placeholder="5"
                />
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Current Average Value</label>
                  <input
                    type="number"
                    name="current_mean"
                    className="form-input"
                    value={formData.current_mean}
                    onChange={handleChange}
                    step="any"
                    placeholder="50"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Standard Deviation</label>
                  <input
                    type="number"
                    name="current_std"
                    className="form-input"
                    value={formData.current_std}
                    onChange={handleChange}
                    step="any"
                    min="0.01"
                    placeholder="25"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Minimum Lift to Detect (%)</label>
              <input
                type="number"
                name="lift_percent"
                className="form-input"
                value={formData.lift_percent}
                onChange={handleChange}
                step="1"
                min="1"
                placeholder="10"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Daily Visitors (optional)</label>
              <input
                type="number"
                name="daily_visitors"
                className="form-input"
                value={formData.daily_visitors}
                onChange={handleChange}
                step="100"
                min="1"
                placeholder="10000"
              />
            </div>

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

            <div className="form-group">
              <label className="form-label">Statistical Power</label>
              <select
                name="power"
                className="form-select"
                value={formData.power}
                onChange={handleChange}
              >
                <option value={70}>70%</option>
                <option value={80}>80%</option>
                <option value={90}>90%</option>
              </select>
            </div>
          </div>

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
          <div className="result-grid">
            <div className="result-item">
              <div className="result-label">Per Variant</div>
              <div className="result-value">{result.visitors_per_variant.toLocaleString()}</div>
              <div className="result-unit">visitors</div>
            </div>
            <div className="result-item">
              <div className="result-label">Total</div>
              <div className="result-value">{result.total_visitors.toLocaleString()}</div>
              <div className="result-unit">visitors</div>
            </div>
            {result.test_duration_days && (
              <div className="result-item">
                <div className="result-label">Duration</div>
                <div className="result-value">{result.test_duration_days}</div>
                <div className="result-unit">days</div>
              </div>
            )}
            <div className="result-item">
              <div className="result-label">Expected Rate</div>
              <div className="result-value">
                {testType === 'binary' 
                  ? `${(result.expected_rate * 100).toFixed(1)}%`
                  : `$${result.expected_mean?.toFixed(0)}`
                }
              </div>
            </div>
          </div>

          <div className="callout callout-info" style={{ marginTop: '16px' }}>
            <div className="callout-text">
              If the variant improves by {result.lift_percent}% or more, this test has an {result.power}% chance of detecting it with {result.confidence}% confidence.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SampleSizeCalculator
