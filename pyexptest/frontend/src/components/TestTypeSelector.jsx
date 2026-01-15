const TEST_TYPES = {
  conversion: {
    id: 'conversion',
    label: 'Conversion Rate',
    description: 'Binary outcomes like clicks, sign-ups, purchases',
    examples: 'Did user purchase? (Yes/No), Did user click? (Yes/No)',
    icon: '🎯',
  },
  magnitude: {
    id: 'magnitude',
    label: 'Revenue / Continuous',
    description: 'Numerical values like revenue, time on page, order value',
    examples: 'Order value ($52.30), Time on page (45 sec)',
    icon: '📈',
  },
}

function TestTypeSelector({ value, onChange, showDescriptions = true }) {
  return (
    <div className="test-type-selector">
      <div className="test-type-options">
        {Object.values(TEST_TYPES).map((type) => (
          <button
            key={type.id}
            className={`test-type-option ${value === type.id ? 'active' : ''}`}
            onClick={() => onChange(type.id)}
            type="button"
          >
            <span className="test-type-icon">{type.icon}</span>
            <div className="test-type-content">
              <div className="test-type-label">{type.label}</div>
              {showDescriptions && (
                <div className="test-type-description">{type.description}</div>
              )}
            </div>
          </button>
        ))}
      </div>
      {showDescriptions && value && (
        <div className="test-type-example">
          <span className="example-label">Example:</span> {TEST_TYPES[value].examples}
        </div>
      )}
    </div>
  )
}

export { TEST_TYPES }
export default TestTypeSelector
