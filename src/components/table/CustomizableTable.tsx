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
import { ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

export interface Column<T extends object> {
  label: string; // header displayed text
  key: keyof T & string; // header/attribute key
  render?: (value: T[keyof T], row: T) => ReactNode; // optional custom cell renderer
  width?: number;
  sortable?: boolean;
}

export interface TableProps<T extends object>
  extends Omit<AgGridReactProps<T>, "rowData" | "columnDefs"> {
  headers: Column<T>[];
  data: T[];
  height?: number | string;
  pagination?: boolean;
}

export default function CustomizableTable<T extends object>({
  headers,
  data,
  className,
  height = "auto",
  pagination = true,
  defaultColDef,
  ...gridProps
}: TableProps<T>) {
  const columnDefs = useMemo<ColDef<T>[]>(
    () =>
      headers.map((header) => {
        const renderCell = header.render;

        // Adapter for Custom Renderers
        const cellRenderer = renderCell
          ? (params: ICellRendererParams<T, T[keyof T]>) =>
              renderCell(params.value as T[keyof T], params.data as T)
          : undefined;
        const field = header.key as unknown as ColDefField<T>;

        return {
          headerName: header.label,
          field,
          flex: header.width ? undefined : 1,
          width: header.width,
          wrapText: true,
          autoHeight: true,
          sortable: header.sortable ?? true,
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
      ...defaultColDef,
    }),
    [defaultColDef],
  );

  const wrapperClassName = useMemo(
    () =>
      [
        "ag-theme-quartz dark:ag-theme-quartz-dark w-full overflow-auto",
        // Centers the flex container (Label + Icon)
        "[&_.ag-header-cell-label]:justify-center",
        // Centers the text span itself
        "[&_.ag-header-cell-text]:text-center",
        // Forces the text span to take full width (so it can center)
        "[&_.ag-header-cell-text]:w-full",
        className,
      ]
        .filter((value): value is string => Boolean(value && value.trim()))
        .join(" "),
    [className],
  );

  return (
    <div className={wrapperClassName} style={{ height }}>
      <AgGridReact<T>
        theme={"legacy"}
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={mergedDefaultColDef}
        suppressCellFocus
        domLayout={height === "auto" ? "autoHeight" : "normal"}
        pagination={pagination}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        {...gridProps}
      />
    </div>
  );
}
