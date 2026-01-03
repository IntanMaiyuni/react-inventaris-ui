function ItemCard({ item }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-indigo-300 transform hover:-translate-y-1">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
          <span className="text-white font-bold text-lg">
            {item.name.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {item.name}
          </h3>
          <p className="text-sm text-gray-500">{item.category}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <span className="text-sm text-gray-600">Stok</span>
        <span
          className={`px-4 py-1 rounded-full text-xs font-semibold ${
            item.stock <= 2
              ? "bg-red-100 text-red-600"
              : item.stock <= 10
              ? "bg-yellow-100 text-yellow-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {item.stock} unit
        </span>
      </div>
    </div>
  );
}

export default ItemCard;
