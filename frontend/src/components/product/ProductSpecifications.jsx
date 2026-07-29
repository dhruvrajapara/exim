export default function ProductSpecifications({ specifications = [] }) {
  if (!specifications || specifications.length === 0) return null;

  // Handle Legacy flat-array format vs new array-of-tables format
  const isLegacy = specifications.length > 0 && !specifications[0].items;
  
  const tables = isLegacy 
    ? [
        {
          title: 'Product Specifications',
          items: specifications.map(s => ({ label: s.key || s.name || s.label || '', value: s.value || '' }))
        }
      ] 
    : specifications;

  return (
    <div className="flex flex-col gap-10 md:gap-16 mb-10 md:mb-20">
      {tables.map((table, tableIndex) => {
        if (!table.items || table.items.length === 0) return null;

        // Chunk specifications into groups of 2 for desktop layout
        const chunkedSpecs = [];
        for (let i = 0; i < table.items.length; i += 2) {
          chunkedSpecs.push([table.items[i], table.items[i + 1] || null]);
        }

        return (
          <div key={tableIndex} className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 md:p-8 lg:p-10">
            {table.title && (
              <h3 className="font-rubik text-[20px] md:text-[24px] font-bold text-dark mb-4 pb-3 md:mb-6 md:pb-4 border-b border-gray-100">
                {table.title}
              </h3>
            )}
            
            <div className="rounded-[12px] border border-gray-100 overflow-hidden">
              {/* Mobile View: 2 columns (1 Title, 1 Value) */}
              <table className="w-full text-left border-collapse md:hidden">
                <tbody>
                  {table.items.map((spec, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-gray-100 last:border-0 ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}
                    >
                      <th className="py-2 px-3 text-[14px] md:text-[15px] text-dark font-semibold w-[40%] border-r border-gray-100">
                        {spec.label}
                      </th>
                      <td className="py-2 px-3 text-[13px] md:text-[15px] text-gray-600 font-medium">
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
                        {row[0].label}
                      </th>
                      <td className="py-4 px-6 text-gray-600 font-medium w-1/4 border-r border-gray-100">
                        {row[0].value}
                      </td>

                      {/* Specification 2 */}
                      <th className="py-4 px-6 text-dark font-semibold w-1/4 border-r border-gray-100">
                        {row[1] ? row[1].label : ''}
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
      })}
    </div>
  );
}
