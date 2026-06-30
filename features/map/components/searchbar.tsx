// import { Search } from "lucide-react";

// interface SearchBarProps {
//   query: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   count: number;
// }

// export const SearchBar = ({ query, onChange, count }: SearchBarProps) => (
//   <div className="p-4 border-b border-gray-100">
//     <div className="relative">
//       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//       <input
//         type="text"
//         placeholder="Search business or address..."
//         className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ea4335] outline-none text-sm transition-all"
//         value={query}
//         onChange={onChange}
//       />
//     </div>
//     <p className="text-[11px] text-gray-400 mt-2 font-medium uppercase tracking-wider">
//       {count} Locations Found
//     </p>
//   </div>
// );