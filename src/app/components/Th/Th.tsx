"use client";

import Image from 'next/image'
import upArrow from  '../../../../public/up-arrow.png';
import downArrow from  '../../../../public/down-arrow.png';
import { FC } from 'react';

interface ThProps {
    sortConfig: { key: string; direction: string; } | null,
    text: string;
    onSort(label: string): void,
    label: string
}

const Th: FC<ThProps> = ({
    label,
    text,
    onSort,
    sortConfig
  }) => {
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
export default Th;