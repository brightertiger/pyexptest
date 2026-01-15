import { useState } from 'react'

function HelpTooltip({ text, children }) {
  const [show, setShow] = useState(false)

  return (
    <span 
      className="help-tooltip-wrapper"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <span className="help-icon">?</span>
      {show && (
        <div className="help-tooltip">
          {text}
        </div>
      )}
    </span>
  )
}

export default HelpTooltip
