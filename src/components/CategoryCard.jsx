function CategoryCard({ name }) {
  return (
    <div className="bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{name}</h3>
        <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
          Aktif
        </span>
      </div>
    </div>
  );
}

export default CategoryCard;
