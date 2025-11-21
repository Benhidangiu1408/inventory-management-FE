"use client";

import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColDefField,
  colorSchemeDarkBlue,
  CustomFilterModule,
  DateFilterModule,
  GetDetailRowDataParams,
  ICellRendererParams,
  IDetailCellRendererParams,
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  TextFilterModule,
  themeQuartz,
  ValidationModule,
} from "ag-grid-community";
import {
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
import { Column, TableProps } from "@/components/table/CustomizableTable";
import { useTheme } from "@/context/ThemeContext";
import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PaginationModule,
  CellStyleModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  CustomFilterModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  ClipboardModule,
  ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);

interface AccordionTableProps<T extends object, D extends object>
  extends TableProps<T> {
  // The key where the child array lives (e.g., "orders")
  subTableKey: keyof T;
  // Headers for the sub-table
  subTableHeaders: Column<D>[];
}

export default function AccordionTable<T extends object, D extends object>({
  headers,
  data,
  subTableKey,
  subTableHeaders,
  className,
  height = "auto",
  defaultColDef,
  ...gridProps
}: AccordionTableProps<T, D>) {
  // Table Theme
  const { theme } = useTheme();
  const agTheme = useMemo(() => {
    return theme === "light"
      ? themeQuartz
      : themeQuartz.withPart(colorSchemeDarkBlue);
  }, [theme]);

  // Main Column Config
  const columnDefs = useMemo<ColDef<T>[]>(
    () => [
      // The "Expander" Column
      {
        headerName: "",
        width: 50,
        minWidth: 50,
        cellRenderer: "agGroupCellRenderer", // Built-in expander arrow
        resizable: false,
        suppressSizeToFit: true,
        filter: false,
        sortable: false,
        suppressHeaderContextMenu: true,
      },
      ...headers.map((header) => {
        const renderCell = header.render;
        const cellRenderer = renderCell
          ? (params: ICellRendererParams<T, T[keyof T]>) =>
              renderCell(params.value as T[keyof T], params.data as T)
          : undefined;

        return {
          headerName: header.label,
          field: header.key as unknown as ColDefField<T>,
          flex: header.width ? 0 : 1,
          width: header.width,
          sortable: header.sortable ?? true,
          cellClass: header.stopCenterData ? "" : "text-center",
          cellRenderer,
        } satisfies ColDef<T>;
      }),
    ],
    [headers],
  );

  // Common column config
  const mergedDefaultColDef = useMemo<ColDef>(
    () => ({
      filter: true,
      minWidth: 150,
      suppressHeaderMenuButton: true,
      ...defaultColDef,
    }),
    [defaultColDef],
  );

  // Row Detail Table
  const detailCellRendererParams = useMemo(() => {
    const detailColumnDefs: ColDef[] = subTableHeaders.map((header) => {
      const renderCell = header.render;
      const cellRenderer = renderCell
        ? (params: ICellRendererParams) => renderCell(params.value, params.data)
        : undefined;

      return {
        headerName: header.label,
        field: header.key as unknown as ColDefField<D>,
        flex: header.width ? 0 : 1,
        width: header.width,
        sortable: header.sortable ?? true,
        cellClass: header.stopCenterData ? "" : "text-center",
        cellRenderer,
      } satisfies ColDef<D>;
    });

    return {
      // Configure the inner grid
      detailGridOptions: {
        columnDefs: detailColumnDefs,
        defaultColDef: {
          filter: true,
          minWidth: 150,
        },
        theme:
          theme === "light"
            ? themeQuartz
            : themeQuartz.withPart(colorSchemeDarkBlue),
        pagination: true,
        paginationPageSize: 10,
        paginationAutoPageSize: true,
      },

      // B. Tell AG Grid how to find the data
      getDetailRowData: (params: GetDetailRowDataParams) => {
        // Pull the array from the row data using your key (e.g., row.orders)
        const subData = params.data[subTableKey];
        params.successCallback(subData);
      },
    } as IDetailCellRendererParams<T, D>;
  }, [subTableHeaders, subTableKey, theme]);

  // table style
  const wrapperClassName = useMemo(
    () =>
      [
        "w-full",
        // Centers the flex container (Label + Icon)
        "[&_.ag-header-cell-label]:justify-center",
        // // Centers the text span itself
        "[&_.ag-header-cell-text]:text-center",
        // // Forces the text span to take full width (so it can center)
        "[&_.ag-header-cell-text]:w-full",
        "[&_.ag-header-cell-text]:font-semibold",
        "[&_.ag-details-row]:!p-2",
        className,
      ]
        .filter((value): value is string => Boolean(value && value.trim()))
        .join(" "),
    [className],
  );

  return (
    <div className={wrapperClassName} style={{ height }}>
      <AgGridReact<T>
        theme={agTheme}
        columnDefs={columnDefs}
        defaultColDef={mergedDefaultColDef}
        rowData={data}
        detailCellRendererParams={detailCellRendererParams}
        domLayout={height === "auto" ? "autoHeight" : "normal"}
        suppressCellFocus={true}
        masterDetail={true}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        {...gridProps}
      />
    </div>
  );
}
