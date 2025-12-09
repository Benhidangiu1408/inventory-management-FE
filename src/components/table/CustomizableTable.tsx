"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColDefField,
  CustomFilterModule,
  DateFilterModule,
  ICellRendererParams,
  NumberFilterModule,
  PaginationModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { AgGridReact, type AgGridReactProps } from "ag-grid-react";
import {
  ModuleRegistry,
  themeQuartz,
  colorSchemeDarkBlue,
} from "ag-grid-community";
import { useTheme } from "@/context/ThemeContext";
import {
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import Pagination from "@/components/table/Pagination";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PaginationModule,
  CellStyleModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  CustomFilterModule,
  ColumnMenuModule,
  ClipboardModule,
  ContextMenuModule,
  ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);

export interface Column<T extends object> {
  label: string; // header displayed text
  key: keyof T & string; // header/attribute key
  render?: (value: T[keyof T], row: T) => ReactNode; // optional custom cell renderer
  width?: number;
  sortable?: boolean;
  stopCenterData?: boolean;
}

export interface TableProps<T extends object>
  extends Omit<AgGridReactProps<T>, "rowData" | "columnDefs"> {
  headers: Column<T>[];
  data: T[];
  height?: number | string;
}

export default function CustomizableTable<T extends object>({
  headers,
  data,
  className,
  height = "auto",
  defaultColDef,
  ...gridProps
}: TableProps<T>) {
  //   Table Theme
  const { theme } = useTheme();
  const agTheme = useMemo(() => {
    return theme === "light"
      ? themeQuartz
      : themeQuartz.withPart(colorSchemeDarkBlue);
  }, [theme]);

  // Column Config
  const columnDefs = useMemo<ColDef<T>[]>(
    () =>
      headers.map((header) => {
        const stopGridEvent = (event: SyntheticEvent) => {
          event.stopPropagation();
        };
        const renderCell = header.render;
        // Adapter for Custom Renderers
        // const cellRenderer = renderCell
        //   ? (params: ICellRendererParams<T, T[keyof T]>) =>
        //       renderCell(params.value as T[keyof T], params.data as T)
        //   : undefined;
        const cellRenderer = renderCell
          ? (params: ICellRendererParams<T, T[keyof T]>) => (
              <div
                data-grid-interactive="true"
                onClick={stopGridEvent}
                onMouseDown={stopGridEvent}
                onMouseUp={stopGridEvent}
                onDoubleClick={stopGridEvent}
                onTouchStart={stopGridEvent}
                onContextMenu={stopGridEvent}
              >
                {renderCell(params.value as T[keyof T], params.data as T)}
              </div>
            )
          : undefined;

        return {
          headerName: header.label,
          field: header.key as unknown as ColDefField<T>,
          flex: header.width ? 0 : 1,
          width: header.width,
          sortable: header.sortable ?? true,
          cellClass: header.stopCenterData ? "" : "text-center",
          cellRenderer,
          suppressKeyboardEvent: () => true,
        } satisfies ColDef<T>;
      }),
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
        className,
      ]
        .filter((value): value is string => Boolean(value && value.trim()))
        .join(" "),
    [className],
  );

  // Pagination
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
    // we say page 4, as the first page is zero
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

  const handlePageSizeChange = useCallback<Dispatch<SetStateAction<number>>>(
    (value) => {
      setPageSize((prev) => {
        const next =
          typeof value === "function" ? value(prev) : (value as number);
        gridRef.current?.api.paginationSetPageSize(next);
        return next;
      });
    },
    [],
  );

  const isInteractiveEvent = useCallback((domEvent?: Event | null) => {
    if (!domEvent) return false;
    if (domEvent.defaultPrevented) return true;
    const target = domEvent.target as HTMLElement | null;
    return Boolean(target?.closest('[data-grid-interactive="true"]'));
  }, []);

  return (
    <div className={wrapperClassName} style={{ height }}>
      <AgGridReact<T>
        ref={gridRef}
        theme={agTheme}
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={mergedDefaultColDef}
        suppressCellFocus={true}
        suppressRowClickSelection={true}
        domLayout={height === "auto" ? "autoHeight" : "normal"}
        pagination={true}
        paginationPageSize={pageSize}
        suppressPaginationPanel={true}
        suppressScrollOnNewData={true}
        onPaginationChanged={onPaginationChange}
        onRowClicked={(event) => {
          if (isInteractiveEvent(event.event)) {
            return;
          }
          const row = event.data as T & { id?: string | number };
          if (row?.id == null) {
            return;
          }
          window.location.href = `/profile/${row.id}`; // or any route
        }}
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
        setPageSize={handlePageSizeChange}
      />
    </div>
  );
}
