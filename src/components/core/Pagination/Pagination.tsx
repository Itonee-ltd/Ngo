import { Icon } from "@iconify/react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalEntries: number;
    currentTotal: number;
    rowsPerPage: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
  }
  

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalEntries,
    currentTotal,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
  }) => {
    const handlePreviousPage = () => {
      if (currentPage > 1) onPageChange(currentPage - 1);
    };
  
    const handleNextPage = () => {
      if (currentPage < totalPages) onPageChange(currentPage + 1);
    };
  
    return (
      <div className="flex items-center gap-6 mt-4 justify-end">
        <div className="flex items-center gap-4 text-gray-900 font-medium">
          <h1>
            Rows per page: <span className="ml-2">{rowsPerPage}</span>
          </h1>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="text-sm bg-white border border-gray-300 rounded px-2 py-1"
          >
            {[5, 10, 12, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
  
        <div className="font-medium text-gray-900">
          <h1>
            Showing {currentTotal} of {totalEntries} entries
          </h1>
        </div>
  
        <div className="flex items-center gap-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-full bg-[#E8F0FD] ${
              currentPage === 1 ? "opacity-50" : ""
            }`}
          >
            <Icon
              icon="ph:caret-left"
              className="w-[22px] h-[22px] text-[#0086F2]"
            />
          </button>
  
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full bg-[#E8F0FD] ${
              currentPage === totalPages ? "opacity-50" : ""
            }`}
          >
            <Icon
              icon="ph:caret-right"
              className="w-[22px] h-[22px] text-[#0086F2]"
            />
          </button>
        </div>
      </div>
    );
  };

  export default Pagination