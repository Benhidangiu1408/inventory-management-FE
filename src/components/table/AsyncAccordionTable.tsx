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
  GetRowIdParams,
  ICellRendererParams,
  IDetailCellRendererParams,
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  TextFilterModule,
  themeQuartz,
  ValidationModule,
  ValueGetterParams,
  RowAutoHeightModule,
} from "ag-grid-community";
import {
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  MasterDetailModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { Column, TableProps } from "@/components/table/CustomizableTable";
import { useTheme } from "@/context/ThemeContext";
import { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import Pagination from "@/components/table/Pagination";

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
  SetFilterModule,
  RowAutoHeightModule,
  ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);

interface AsyncAccordionTableProps<T extends object, D extends object>
  extends TableProps<T> {
  // Async function called on row expand to fetch sub-table data
  getDetailRowDataFn: (rowData: T) => Promise<D[]>;
  // Headers for the sub-table
  subTableHeaders: Column<D>[];
  subTableGetRowId?: (params: GetRowIdParams<D>) => string;
}

export default function AsyncAccordionTable<
  T extends object,
  D extends object,
>({
  headers,
  data,
  getDetailRowDataFn,
  subTableHeaders,
  subTableGetRowId,
  className,
  height = "auto",
  defaultColDef,
  getRowId,
  ...gridProps
}: AsyncAccordionTableProps<T, D>) {
  const { theme } = useTheme();
  const agTheme = useMemo(() => {
    return theme === "light"
      ? themeQuartz
      : themeQuartz.withPart(colorSchemeDarkBlue);
  }, [theme]);

  const columnDefs = useMemo<ColDef<T>[]>(
    () => [
      {
        headerName: "",
        width: 50,
        minWidth: 50,
        cellRenderer: "agGroupCellRenderer",
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
          minWidth: header.minWidth,
          sort: header.sort ? "asc" : undefined,
          sortable: header.sortable ?? true,
          cellClass: header.stopCenterData ? "" : "text-center",
          autoHeight: header.autoHeight,
          wrapText: header.autoHeight,
          cellRenderer,
          filter: header.filter,
          filterParams: header.filterParams,
          valueGetter: header.valueGetter
            ? (params: ValueGetterParams<T>) =>
                params.data ? header.valueGetter?.(params.data) : null
            : undefined,
        } satisfies ColDef<T>;
      }),
    ],
    [headers],
  );

  const mergedDefaultColDef = useMemo<ColDef>(
    () => ({
      filter: true,
      minWidth: 150,
      suppressHeaderMenuButton: true,
      ...defaultColDef,
    }),
    [defaultColDef],
  );

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
        minWidth: header.minWidth,
        sort: header.sort ? "asc" : undefined,
        sortable: header.sortable ?? true,
        cellClass: header.stopCenterData ? "" : "text-center",
        autoHeight: header.autoHeight,
        wrapText: header.autoHeight,
        cellRenderer,
        filter: header.filter,
        filterParams: header.filterParams,
        valueGetter: header.valueGetter
          ? (params: ValueGetterParams<D>) =>
              params.data ? header.valueGetter?.(params.data) : null
          : undefined,
      } satisfies ColDef<D>;
    });

    return {
      detailGridOptions: {
        suppressCellFocus: true,
        columnDefs: detailColumnDefs,
        getRowId: subTableGetRowId,
        defaultColDef: {
          filter: true,
          minWidth: 150,
          suppressHeaderMenuButton: true,
        },
        theme:
          theme === "light"
            ? themeQuartz
            : themeQuartz.withPart(colorSchemeDarkBlue),
        pagination: true,
        paginationPageSize: 10,
        paginationPageSizeSelector: [10, 20, 50, 100],
      },
      getDetailRowData: (params: GetDetailRowDataParams) => {
        getDetailRowDataFn(params.data as T).then((result) =>
          params.successCallback(result),
        );
      },
    } as IDetailCellRendererParams<T, D>;
  }, [subTableHeaders, subTableGetRowId, theme, getDetailRowDataFn]);

  const wrapperClassName = useMemo(
    () =>
      [
        "w-full",
        "[&_.ag-header-cell-label]:justify-center",
        "[&_.ag-header-cell-text]:text-center",
        "[&_.ag-header-cell-text]:w-full",
        "[&_.ag-header-cell-text]:font-semibold",
        "[&_.ag-details-row]:!p-2",
        className,
      ]
        .filter((value): value is string => Boolean(value && value.trim()))
        .join(" "),
    [className],
  );

  const gridRef = useRef<AgGridReact<T>>(null);
  const onBtnFirst = useCallback(() => {
    gridRef.current!.api.paginationGoToFirstPage();
  }, []);
  const onBtnLast = useCallback(() => {
    gridRef.current!.api.paginationGoToLastPage();
  }, []);
  const onBtnNext = useCallback(() => {
    gridRef.current!.api.paginationGoToNextPage();
  }, []);
  const onBtnPrevious = useCallback(() => {
    gridRef.current!.api.paginationGoToPreviousPage();
  }, []);
  const onBtnPage = useCallback((pageNum: number) => {
    gridRef.current!.api.paginationGoToPage(pageNum);
  }, []);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const onPaginationChange = useCallback(() => {
    if (gridRef.current!.api!) {
      setCurrentPage(gridRef.current!.api.paginationGetCurrentPage());
      setTotalPage(gridRef.current!.api.paginationGetTotalPages());
    }
  }, []);

  return (
    <div className={wrapperClassName} style={{ height }}>
      <AgGridReact<T>
        ref={gridRef}
        theme={agTheme}
        columnDefs={columnDefs}
        defaultColDef={mergedDefaultColDef}
        rowData={data}
        detailCellRendererParams={detailCellRendererParams}
        domLayout={height === "auto" ? "autoHeight" : "normal"}
        suppressCellFocus={true}
        masterDetail={true}
        pagination={true}
        paginationPageSize={pageSize}
        suppressPaginationPanel={true}
        suppressScrollOnNewData={true}
        onPaginationChanged={onPaginationChange}
        getRowId={getRowId}
        {...gridProps}
      />
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onBtnFirst={onBtnFirst}
        onBtnLast={onBtnLast}
        onBtnPrevious={onBtnPrevious}
        onBtnNext={onBtnNext}
        onBtnPage={onBtnPage}
        setPageSize={setPageSize}
      />
    </div>
  );
}
