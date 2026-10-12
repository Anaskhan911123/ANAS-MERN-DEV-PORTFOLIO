const CategoryTag = ({ name, color }) => {
  if (!name) return null;
  return (
    <span
      className="category-tag"
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}55` }}
    >
      {name}
    </span>
  );
};

export default CategoryTag;