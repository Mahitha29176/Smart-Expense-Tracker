const StatCard = ({ label, value, icon, tone }) => (
  <div className={`stat-card stat-${tone || 'default'}`}>
    <div className="stat-icon">{icon}</div>
    <div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  </div>
);

export default StatCard;
