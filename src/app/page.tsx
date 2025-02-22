"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Th from "./components/Th/Th";
import TableFooter from "./components/TableFooter/TableFooter";
import { Advocate } from "@/app/types/types";
import { sortArray } from "./utils/utils";

export default function Home() {
  const PAGE_SIZE_OPTS = [5, 10, 25, 50];
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [error, setError] = useState<Record<string, unknown>>();
  const [page, setPage] = useState<number>(1);
  const [sortConfig, setSortConfig] = useState<{ key:string; direction: string } | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [shouldSearch, setShouldSearch] = useState<boolean>(false);
  const [selectedPageSize, setSelectedPageSize] = useState<number>(PAGE_SIZE_OPTS[0]);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  const noResultsFound = 'No results match your search criteria.';

  useEffect(() => {
    const getAdvocates = async () => {
      try {
        const params = new URLSearchParams();
        params.append('pageSize', selectedPageSize.toString());
        params.append('page', page.toString());
        if (!!searchRef.current && searchRef.current?.value) params.append('searchText', searchRef.current.value);

        const res = await fetch(`/api/advocates?${params.toString()}`);
        if (!res.ok) {
          // Handle error cases
          // Add possible alert or snackbar future enhancement
          throw new Error('Failed to fetch advocates.');
        }
        try {
          const { data, totalCount } = await res.json();
          const initPageCalc = totalCount[0].count / selectedPageSize
          if (initPageCalc < 1) {
            setTotalPages(1);
          } else {
            setTotalPages(Math.ceil(initPageCalc));
          }

          setFilteredAdvocates(data);
        } catch(e: any) {
          setError(e);
        } finally {
          setIsFetching(false);
        }
      } catch (e: any) {
        setError(e);
      }
    }

    getAdvocates();
  }, [shouldSearch]);

  const nextPage = () => {
   if (page === totalPages) return;

   setPage(page + 1);
   setShouldSearch(!shouldSearch);
  };

  const prevPage = () => {
    if (page === 1) return;

    setPage(page - 1);
    setShouldSearch(!shouldSearch);
  };

  const handlePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
    if (selectedPageSize === Number(e.target.value)) return;

    setSelectedPageSize(Number(e.target.value));
    setPage(1);
    setShouldSearch(!shouldSearch);
  }

  const sortedItems = useMemo(() => {
    let sortedAdvocates: Advocate[] = []
    if (!!filteredAdvocates) sortedAdvocates = [...filteredAdvocates];
    if (sortConfig !== null) {
      const {key , direction} = sortConfig;
      sortArray(sortedAdvocates, key as keyof Advocate, direction);
    }
    return sortedAdvocates;
  }, [filteredAdvocates, sortConfig]);

  const onSort = (key: string) : void => {
    let direction = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }

  const clearSearch = () : void => {
    if (searchRef.current && searchRef.current.value?.length === 0 ) return;

    setShouldSearch(!shouldSearch);
    if (searchRef.current) {
      searchRef.current.value = ''
    }
  };

  const handleSearch = () => {
    if (searchRef.current && searchRef.current.value?.length === 0 ) return;

    setShouldSearch(!shouldSearch);
  };

  const clearSort = () : void => {
    setSortConfig(null);
  };
 
  return (
    <main className="m-6">
      <h1 className="text-2xl font-black text-gray-700 dark:text-white">Solace Advocates</h1>
      <br />
      <br />
      <div>
        <label className="text-lg font-normal text-gray-500 dark:text-white mr-2">Search</label>
        <input className="border border-black-500 px-4 py-2" ref={searchRef} disabled={isFetching} />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-5 rounded" onClick={handleSearch} disabled={isFetching}>Search</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-5 rounded" onClick={clearSearch} disabled={isFetching}>Reset Search</button>
        {sortConfig !== null && <button className="bg-blue-500 hover:bg-blue-500 text-white font-bold py-2 px-4 m-5 rounded" onClick={clearSort} disabled={isFetching}>Clear Sort</button> }
      </div>
      <br />
      <table className="table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="bg-blue-500 text-white">
          <tr>
            <Th
              sortConfig={sortConfig}
              text="First Name"
              label="firstName"
              onSort={() => onSort('firstName')}
            />

            <Th
              sortConfig={sortConfig}
              text="Last Name"
              label="lastName"
              onSort={() => onSort('lastName')}
            />

            <Th
              sortConfig={sortConfig}
              text="City"
              label="city"
              onSort={() => onSort('city')}
            />

            <Th
              sortConfig={sortConfig}
              text="Degree"
              label="degree"
              onSort={() => onSort('degree')}
            />

            <Th
              sortConfig={sortConfig}
              text="Specialties"
              label="specialties"
              onSort={() => onSort('specialties')}
            />

            <Th
              sortConfig={sortConfig}
              text="Years of Experience"
              label="yearsOfExperience"
              onSort={() => onSort('yearsOfExperience')}
            />

            <Th
              sortConfig={sortConfig}
              text="Phone Number"
              label="phoneNumber"
              onSort={() => onSort('phoneNumber')}
            />
          </tr>
        </thead>
        <tbody>
          {isFetching &&  <tr className="h-full px-4 py-4"><td>Loading...</td></tr>}
          {sortedItems.length > 0 &&
            sortedItems.map((advocate, idx) => {
              return (
                <tr className="h-auto" key={`${advocate.lastName}-${idx}`}>
                  <td>{advocate.firstName}</td>
                  <td>{advocate.lastName}</td>
                  <td>{advocate.city}</td>
                  <td>{advocate.degree}</td>
                  <td>
                    <ul>
                    {advocate.specialties.map((s, idx) => (
                      <li key={`${s}-${idx}`}>{s}</li>
                    ))}
                    </ul>
                  </td>
                  <td>{advocate?.yearsOfExperience}</td>
                  <td>{advocate.phoneNumber}</td>
                </tr>
              );
          })}
          {!isFetching && !!filteredAdvocates && filteredAdvocates?.length === 0 && <tr className="h-full px-4 py-4"><td className="text-nowrap">{noResultsFound}</td></tr>}
        </tbody>
      </table>
      <TableFooter pageSizeOpts={PAGE_SIZE_OPTS} totalPages={totalPages} currentPageSize={selectedPageSize} currentPage={page} handlePageSize={handlePageSize} nextPage={nextPage} prevPage={prevPage} />
    </main>
  );
}
