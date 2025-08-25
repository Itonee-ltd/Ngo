import React from "react";
// import { ReactComponent as Sort } from "assets/svg/sort.svg"
import "./table.css";
// import { RenderIf } from "@/components/hoc";
// import { Pagination } from "../Pagination/Pagination";
// import { TableLoader } from "./TableLoader/TableLoader";
import { EmptyState } from "./EmptyState/EmptyState";

interface TableProps {
  minHeight?: string;
  tableContainer?: string;
  data: any[]; // table data
  loading?: boolean;
  hasHeader?: boolean;
  headers: any[]; // table headers
  handleSort?: () => void; // on click event for table sorting
  children?: any;
  emptyStateText?: string;
  emptyStateImage?: any;
  paginateData?: boolean;
  totalCount?: number; // total count of table data
  // eslint-disable-next-line
  onPageChange?: (e: any) => void; // handle pagination change
  // eslint-disable-next-line
  selectLimit?: (e: any) => void; // handle pagination change
  perPage?: number;
  page?: number;
}

export const Table: React.FC<TableProps> = ({
  minHeight,
  tableContainer,
  hasHeader = true,
  data,
  headers,
  // handleSort,
  // paginateData = true,
  loading,
  children,
  emptyStateText,
  emptyStateImage,
  // onPageChange,
  // selectLimit,
  // totalCount,
  // perPage = 10,
  // page = 1,
}) => {
  // const [currentPage, setCurrentPage] = React.useState<number>(page);
  // const [rowsPerPage, setRowsPerPage] = React.useState<number>(perPage);

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  //   onPageChange && onPageChange(page);
  // };
  // Function to navigate to a specific page
  // const goToPage = (page: number) => {
  //   if (page >= 1 && page <= totalCount!) {
  //     handlePageChange(page);
  //   }
  // };

  // Function to navigate to previous page
  // const prev = () => {
  //   if (currentPage > 1) {
  //     handlePageChange(currentPage - 1);
  //   }
  // };

  // // Function to navigate to next page
  // const next = () => {
  //   if (currentPage < totalCount!) {
  //     handlePageChange(Number(currentPage) + 1);
  //   }
  // };

  // Function to handle limit change
  // const updateCurrentLimit = (e: any) => {
  //   setRowsPerPage(e);
  //   selectLimit && selectLimit(e);
  // };

  return (
    <div>
      <div
        data-testid="table"
        className={`w-full h-full overflow-x-auto rounded-lg  ${
          minHeight || "min-h-40vh"
        }`}
      >
        <table className={`w-full ${tableContainer || "w-full h-full"}`}>
          {hasHeader ? (
            <thead>
              <tr className="bg-gray-100  py-3 px-4">
                <td className=" px-4 py-4">
                  <input
                    type="radio"
                    className="w-4 h-4 border border-gray-100"
                  />
                </td>

                {headers?.map(
                  (
                    header: {
                      name:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | null
                        | undefined;
                      sort: any;
                    },
                    i: React.Key | null | undefined
                  ) => (
                    <>
                      <th
                        key={i}
                        className="
                              text-[14px] text-left font-medium text-gray-800  capitalize
                              px-4  py-4 whitespace-nowrap cursor-default"
                      >
                        {header.name}
                        {/* {header.sort && (
                        <Sort data-testid="sort" className="cursor-pointer inline ml-[8px]" onClick={handleSort} />
                      )} */}
                      </th>
                    </>
                  )
                )}
              </tr>
            </thead>
          ) : (
            <></>
          )}
          <tbody>{data?.length && !loading ? children : <></>}</tbody>
        </table>
        {/* {loading && <TableLoader />} */}
        {loading && (
          <tbody>
            <div className="flex w-full items-center justify-center">
              Loading...
            </div>
          </tbody>
        )}
        {!loading && !data?.length ? (
          <EmptyState
            emptyStateText={emptyStateText}
            emptyStateImage={emptyStateImage}
          />
        ) : (
          <></>
        )}
      </div>
      {/* <RenderIf condition={paginateData && data?.length > 0 && !loading}>
        <Pagination
          customStyle="px-6 py-3 w-full"
          count={totalCount as number}
          currentPage={currentPage}
          dataLength={totalCount as number}
          totalPages={Math.ceil((totalCount as number) / rowsPerPage)}
          // updateCurrentLimit={(v) => handleRowsPerPageChange(Number(v))}
          updateCurrentLimit={(e) => updateCurrentLimit(e)}
          currentLimit={rowsPerPage?.toString()}
          limits={["5", "10", "20", "50", "100", "200"]}
          prev={prev}
          next={next}
          goToPage={(v) => goToPage(Number(v))}
        />
      </RenderIf> */}
    </div>
  );
};
