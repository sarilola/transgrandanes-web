import "./FormSection.css";

export const FormSection = ({ icon: Icon, title, accent = false, children, actions }) => {
  return (
    <div className={`form-section${accent ? " form-section--accent" : ""}`}>
      <div className="form-section-header">
        <div className="form-section-title-group">
          {Icon && <Icon className="form-section-icon" aria-hidden="true" />}
          <h3 className="form-section-title">{title}</h3>
        </div>
        {actions && <div className="form-section-actions">{actions}</div>}
      </div>
      <div className="form-section-body">{children}</div>
    </div>
  );
};