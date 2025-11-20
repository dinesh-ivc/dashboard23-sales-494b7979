'use client';

import React from 'react';
import { Table as TableComponent, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Table = ({ columns, data, onRowClick }) => {
  return (
    <div className="rounded-md border">
      <TableComponent>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} className={column.className || ''}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow 
                key={rowIndex} 
                onClick={() => onRowClick && onRowClick(row)}
                className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className={column.cellClassName || ''}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableComponent>
    </div>
  );
};

export { Table };