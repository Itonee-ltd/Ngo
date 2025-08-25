import { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "../useDebounce/useDebounce";

interface Params {
  page: number;
  limit: number;
  sortBy?: string;
  search?: string;
}

export const useTable = (limit = 20) => {
  const initialParams = { page: 1, limit, sortBy: "DESC", search: "" };
  const [searchValue, setSearchValue] = useState<string>("");
  const { debouncedValue } = useDebounce(searchValue);
  const [filterModal, setFilterModal] = useState(false);
  const [params, setParams] = useState<Params>(initialParams);
  const openFilterModal = () => setFilterModal(true);
  const closeFilterModal = () => setFilterModal(false);

  const changePage = (e: any) => setParams({ ...params, page: e });
  const selectLimit = (e: any) => setParams({ ...params, limit: e });
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setParams({ page: 1, limit });
      setSearchValue("");
      return;
    }
    setSearchValue(e.target.value.trim());
  };

  const handleSort = () => {
    setParams({ ...params, sortBy: params.sortBy === "DESC" ? "ASC" : "DESC" });
  };

  const resetParams = () => {
    setParams(initialParams);
    setSearchValue("");
  };

  useEffect(() => {
    if (searchValue && debouncedValue) {
      setParams({ ...params, search: debouncedValue });
    }
  }, [debouncedValue]);

  return {
    params,
    setParams,
    changePage,
    selectLimit,
    handleSort,
    handleSearch,
    filterModal,
    searchValue,
    openFilterModal,
    closeFilterModal,
    resetParams,
  };
};
