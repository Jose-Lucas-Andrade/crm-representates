export default function Card({ title, value, children }) {
  return (
    <div className="card">
      {title && <h4 className="card-title">{title}</h4>}
      {value !== undefined && <p className="card-value">{value}</p>}
      {children}
    </div>
  );
}