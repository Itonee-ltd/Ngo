import { useState } from "react";
import { Icon } from "@iconify/react";
const Filters = ({
  selectedFilter,
  setSelectedFilter,
  filterOptions,
  filterName = "Status",
}: any) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  return (
    <div className="relative w-full sm:w-auto">
      <button
        onClick={() => setIsStatusOpen(!isStatusOpen)}
        className="capitalize border-2 py-2 px-4 rounded-md gap-3 text-gray-600 bg-gray-100 border-gray-300 flex items-center justify-between w-full sm:w-auto"
      >
        {filterName}: {selectedFilter}
        <Icon
          icon="ph:caret-down"
          width="15"
          height="15"
          className="text-[#AEAAAB]"
        />
      </button>
      {isStatusOpen && (
        <ul className="absolute bg-white border rounded-md mt-1 shadow-lg w-full sm:w-40 ">
          {filterOptions.map((filter: any) => (
            <li
              key={filter}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <button
                onClick={() => {
                  setSelectedFilter(filter);
                  setIsStatusOpen(false);
                }}
                className="capitalize"
              >
                {" "}
                {filter}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Filters;