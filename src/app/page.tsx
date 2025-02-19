"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState, FocusEvent } from "react";
import Th from "./components/Th/Th";
import { Advocate } from "@/app/types/types";
import { sortArray } from "./utils/utils";
import { useSearchParams, useRouter } from 'next/navigation';

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [error, setError] = useState<Record<string, unknown>>();
  const [pageSize, setPageSize] = useState<number>(25);
  const [page, setPage] = useState<number>(1);
  const [sortConfig, setSortConfig] = useState<{ key:string; direction: string } | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [shouldSearch, setShouldSearch] = useState<boolean>(false);

  const noResultsFound = 'No results match your search criteria.';

  const searchParams = useSearchParams();
  const router = useRouter();


  useEffect(() => {
    // TODO: Handle pagination && pageSize as api parameters
    const getAdvocates = async () => {
      try {
        const params = new URLSearchParams();
        params.append('pageSize', pageSize.toString());
        params.append('page', page.toString());
        if (!!searchRef.current && searchRef.current?.value) params.append('searchText', searchRef.current.value);

        const res = await fetch(`/api/advocates?${params.toString()}`);
        if (!res.ok) {
          // Handle error cases
          // Add possible alert or snackbar future enhancement
          throw new Error('Failed to fetch advocates.');
        }
        try {
          const { data } = await res.json();
          setAdvocates(data);
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

  // const onChange = (e: ChangeEvent<HTMLInputElement>) : void => {
  //   const searchTerm = e.target.value.toLowerCase();
  //   const filteredAdvocates = advocates.filter((advocate) => {
  //     return (
  //       advocate.firstName.toLowerCase().includes(searchTerm) ||
  //       advocate.lastName.toLowerCase().includes(searchTerm) ||
  //       advocate.city.toLowerCase().includes(searchTerm) ||
  //       advocate.degree.includes(searchTerm) ||
  //       advocate.specialties.map((itm) => itm.toLowerCase()).join(',').replaceAll(',', ' ').includes(searchTerm) ||
  //       advocate.yearsOfExperience.toString().includes(searchTerm) ||
  //       advocate.phoneNumber.toString().includes(searchTerm)
  //     );
  //   });

  //   setFilteredAdvocates(filteredAdvocates);
  // };

  const clearSearch = () : void => {
    setShouldSearch(!shouldSearch);
    if (searchRef.current) {
      searchRef.current.value = ''
    }
  };

  const handleSearch = () => {
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
      <p className="text-sm font-normal text-gray-500 ">
        Searching for: <span>{!!searchRef.current ? searchRef.current?.value : ''}</span>
      </p>
      <br />
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
    </main>
  );
}
