import "./FormField.css";

export const FormField = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  icon: Icon,
  multiline = false,
  className = "",
}) => {
  return (
    <div className={`form-field-wrapper ${className}`}>
      {label && (
        <label className="form-label">
          {Icon && <Icon className="form-label-icon" aria-hidden="true" />}
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          className="form-input form-textarea"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          type={type}
          className="form-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
};