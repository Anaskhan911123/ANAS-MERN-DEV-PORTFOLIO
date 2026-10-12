import './PageHeader.css';

export default function PageHeader({ breadcrumb, eyebrow, title, subtitle, actionLabel, onAction }) {
  return (
    <div className="page-header-block">
      <div className="breadcrumb">{breadcrumb}</div>
      <div className="page-header-row">
        <div>
          <div className="eyebrow" style={{ marginTop: 20 }}>{eyebrow}</div>
          <h1>{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {actionLabel && (
          <button className="btn-primary" onClick={onAction}>{actionLabel}</button>
        )}
      </div>
    </div>
  );
}