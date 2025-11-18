"use client";

import { ReactNode, useMemo } from "react";
import type {
  ColDef,
  ColDefField,
  ICellRendererParams,
} from "ag-grid-community";
import { AgGridReact, type AgGridReactProps } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export interface Column<T extends object> {
  label: string; // header displayed text
  key: keyof T & string; // header/attribute key
  render?: (value: T[keyof T], row: T) => ReactNode; // optional custom cell renderer
}

export interface TableProps<T extends object>
  extends Omit<AgGridReactProps<T>, "rowData" | "columnDefs" | "theme"> {
  headers: Column<T>[];
  data: T[];
  theme?: string;
  height?: number | string;
}

export default function CustomizableTable<T extends object>({
  headers,
  data,
  className,
  theme = "ag-theme-quartz",
  height = "auto",
  defaultColDef,
  ...gridProps
}: TableProps<T>) {
  const columnDefs = useMemo<ColDef<T>[]>(
    () =>
      headers.map((header) => {
        const renderCell = header.render;
        const cellRenderer = renderCell
          ? (params: ICellRendererParams<T, T[keyof T]>) =>
              renderCell(params.value as T[keyof T], params.data as T)
          : undefined;

        const field = header.key as unknown as ColDefField<T>;

        return {
          headerName: header.label,
          field,
          flex: 1,
          wrapText: true,
          autoHeight: true,
          sortable: true,
          filter: true,
          resizable: true,
          cellRenderer,
        } satisfies ColDef<T>;
      }),
    [headers],
  );

  const mergedDefaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      wrapText: true,
      autoHeight: true,
      ...defaultColDef,
    }),
    [defaultColDef],
  );

  const wrapperClassName = useMemo(
    () =>
      ["customizable-table", theme, className]
        .filter((value): value is string => Boolean(value && value.trim()))
        .join(" "),
    [className, theme],
  );

  return (
    <div className={wrapperClassName} style={{ width: "100%", height }}>
      <AgGridReact<T>
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={mergedDefaultColDef}
        suppressCellFocus
        domLayout={height === "auto" ? "autoHeight" : "normal"}
        {...gridProps}
      />
    </div>
  );
}
