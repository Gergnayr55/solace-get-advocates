"use client";
import React, { ChangeEvent, FC } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface TableFooterProps {
    currentPage: number;
    currentPageSize: number;
    totalPages: number | null;
    pageSizeOpts: number[];
    handlePageSize: (e: ChangeEvent<HTMLSelectElement>) => void;
    prevPage: () => void;
    nextPage: () => void;
};

const TableFooter: FC<TableFooterProps> = ({
    currentPage,
    currentPageSize,
    pageSizeOpts,
    totalPages,
    handlePageSize,
    prevPage,
    nextPage
  }) => {
    return (
        <div className="container w-full py-15">
            <div className="flex items-center gap-8 justify-between calcd-width">
                <p className="font-bold text-gray-600">
                    <strong className="text-gray-800">{currentPage}</strong> of{" "}
                    <strong className="text-gray-800">{!!totalPages ? totalPages : '-'}</strong>
                </p>
                <div className="flex gap-4 items-center">
                    <select onChange={handlePageSize} defaultValue={currentPageSize}>
                        {pageSizeOpts.map((itm: number, idx: number) => (
                            <option key={`${itm}-${idx}`} value={itm}>{itm}</option>
                        ))}
                    </select>
                    <button className="flex gap-1 items-center border-gray-300" onClick={prevPage} disabled={currentPage === 1}>
                        <FaChevronLeft className="h-3 w-3"/>
                        Prev
                    </button>
                    <button className="flex gap-1 items-center border-gray-300" onClick={nextPage} disabled={currentPage === totalPages}>
                        Next
                        <FaChevronRight className="h-3 w-3"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableFooter;
