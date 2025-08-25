import { act, renderHook } from "@testing-library/react";
import { useTable } from 'hooks';
import { useDebounce } from "../useDebounce/useDebounce"

jest.mock('../useDebounce/useDebounce');

describe('useTable', () => {
  beforeEach(() => {
    // Mock useDebounce function
    useDebounce.mockImplementation((value) => ({ debouncedValue: value }));
  })

  it('should update params correctly when handleSort is called', () => {
    const { result } = renderHook(() => useTable(10));

    expect(result.current.params.sortBy).toBe('DESC');

    act(() => result.current.handleSort());
    expect(result.current.params.sortBy).toBe('ASC');

    act(() => result.current.handleSort());
    expect(result.current.params.sortBy).toBe('DESC');
  });

  it('should update params correctly when handleSearch is called', () => {
    const { result } = renderHook(() => useTable(10));
    act(() => {
      result.current.handleSearch({ target: { value: 'test' } });
    });
    expect(result.current.searchValue).toBe('test');
    expect(result.current.params.search).toBe('test');
  });

  it('should reset params when search value is empty', () => {
    const { result } = renderHook(() => useTable(10));
    act(() => {
      result.current.handleSearch({ target: { value: '' } });
    });
    expect(result.current.searchValue).toBe("");
    expect(result.current.params.page).toBe(1);
    expect(result.current.params.limit).toBe(10);
  });

  it('should update params correctly when changePage is called', () => {
    const { result } = renderHook(() => useTable(10));
    act(() => {
      result.current.changePage(2);
    });
    expect(result.current.params.page).toBe(2);
  });

  it('should update params correctly when selectLimit is called', () => {
    const { result } = renderHook(() => useTable(10));
    act(() => {
      result.current.selectLimit(20);
    });
    expect(result.current.params.limit).toBe(20);
  });

  it('should toggle filterModal correctly when openFilterModal/closeFilterModal is called', () => {
    const { result } = renderHook(() => useTable(10));
    expect(result.current.filterModal).toBe(false);
    act(() => {
      result.current.openFilterModal();
    });
    expect(result.current.filterModal).toBe(true);
    act(() => {
      result.current.closeFilterModal();
    });
    expect(result.current.filterModal).toBe(false);
  });
});
