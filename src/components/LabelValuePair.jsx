const LabelValuePair = ({ label, value, className = "" }) => {
  return (
    <div className="grid grid-cols-[10rem_1fr] gap-4 items-center">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className={className}>{value}</div>
    </div>
  );
};

export default LabelValuePair;
