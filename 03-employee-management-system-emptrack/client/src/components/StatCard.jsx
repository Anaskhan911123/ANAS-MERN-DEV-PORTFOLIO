const StatCard = ({ label, value, icon: Icon, tint }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${tint}1a` }}>
      <Icon size={20} style={{ color: tint }} />
    </div>
    <div>
      <p className="text-2xl font-extrabold text-ink leading-tight">{value}</p>
      <p className="text-gray-500 text-xs font-medium">{label}</p>
    </div>
  </div>
);

export default StatCard;