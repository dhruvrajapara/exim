export default function ProductSpecifications({ specifications = [] }) {
  if (!specifications || specifications.length === 0) return null;

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 md:p-8 lg:p-10 mb-16 md:mb-20">
      <h3 className="font-rubik text-[24px] font-bold text-dark mb-6 border-b border-gray-100 pb-4">
        Product Specifications
      </h3>
      
      <div className="overflow-hidden rounded-[12px] border border-gray-100">
        <table className="w-full text-left border-collapse">
          <tbody>
            {specifications.map((spec, index) => (
              <tr 
                key={index} 
                className={`border-b border-gray-100 last:border-0 ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}
              >
                <th className="py-4 px-6 text-dark font-semibold w-1/3 md:w-1/4 border-r border-gray-100">
                  {spec.name}
                </th>
                <td className="py-4 px-6 text-gray-600 font-medium">
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
