const categoryColors = {
  Furniture: '#f6d9c9',
  Lighting: '#d7e6f5',
  Accessories: '#d9ede0',
  Electronics: '#e6def7',
};

export function getCategoryColor(category) {
  return categoryColors[category] || '#e5e2d9';
}