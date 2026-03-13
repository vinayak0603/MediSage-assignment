const Badge = ({ type, value }) => {
  const getBadgeStyle = () => {
    if (type === 'status') {
      switch (value) {
        case 'todo':
          return 'bg-gray-100 text-gray-700 border-gray-200';
        case 'in-progress':
          return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'completed':
          return 'bg-green-100 text-green-700 border-green-200';
        default:
          return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    } else if (type === 'priority') {
      switch (value) {
        case 'low':
          return 'bg-slate-100 text-slate-700 border-slate-200';
        case 'medium':
          return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'high':
          return 'bg-red-100 text-red-700 border-red-200';
        default:
          return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    }
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle()} capitalize`}>
      {value.replace('-', ' ')}
    </span>
  );
};

export default Badge;
