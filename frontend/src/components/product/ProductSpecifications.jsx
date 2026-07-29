export default function ProductSpecifications({ specifications = [] }) {
  if (!specifications || specifications.length === 0) return null;

  // Chunk specifications into groups of 2
  const chunkedSpecs = [];
  for (let i = 0; i < specifications.length; i += 2) {
    chunkedSpecs.push([specifications[i], specifications[i + 1] || null]);
  }

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 md:p-8 lg:p-10 mb-16 md:mb-20">
      <h3 className="font-rubik text-[24px] font-bold text-dark mb-6 border-b border-gray-100 pb-4">
        Product Specifications
      </h3>
      
      <div className="rounded-[12px] border border-gray-100 overflow-hidden">
        {/* Mobile View: 2 columns (1 Title, 1 Value) */}
        <table className="w-full text-left border-collapse md:hidden">
          <tbody>
            {specifications.map((spec, index) => (
              <tr 
                key={index} 
                className={`border-b border-gray-100 last:border-0 ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}
              >
                <th className="py-3 px-4 text-dark font-semibold w-1/3 border-r border-gray-100">
                  {spec.name}
                </th>
                <td className="py-3 px-4 text-gray-600 font-medium">
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Desktop View: 4 columns (2 Titles, 2 Values) */}
        <table className="w-full text-left border-collapse hidden md:table">
          <tbody>
            {chunkedSpecs.map((row, index) => (
              <tr 
                key={index} 
                className={`border-b border-gray-100 last:border-0 ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}
              >
                {/* Specification 1 */}
                <th className="py-4 px-6 text-dark font-semibold w-1/4 border-r border-gray-100">
                  {row[0].name}
                </th>
                <td className="py-4 px-6 text-gray-600 font-medium w-1/4 border-r border-gray-100">
                  {row[0].value}
                </td>

                {/* Specification 2 */}
                <th className="py-4 px-6 text-dark font-semibold w-1/4 border-r border-gray-100">
                  {row[1] ? row[1].name : ''}
                </th>
                <td className="py-4 px-6 text-gray-600 font-medium w-1/4">
                  {row[1] ? row[1].value : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
