"use client";

import Image from 'next/image'
import upArrow from  '../../../../public/up-arrow.png';
import downArrow from  '../../../../public/down-arrow.png';

interface Th {
    sortConfig: { key: string; direction: string; } | null,
    text: string;
    onSort(label: string): void,
    label: string
}

export default function Th({ label, text, onSort, sortConfig }: Th) {
    return (
        <th className="border border-gray-300 p-4">
            <button type="button" onClick={() => onSort(label)}>{text}</button>
            {sortConfig?.key === label &&
                <Image
                    className='arrow-img'
                    src={sortConfig.direction === 'ascending' ? upArrow : downArrow}
                    width={16}
                    height={16}
                    alt="up-down-arrow"
                />
            }
        </th>
    )
}