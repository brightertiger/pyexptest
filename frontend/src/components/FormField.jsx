function FormField({ label, hint, children, required = false }) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>
      {children}
      {hint && <div className="form-hint">{hint}</div>}
    </div>
  )
}

export default FormField
