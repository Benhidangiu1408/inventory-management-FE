"use client";
import { useState, Fragment } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Column } from "./CustomizableTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/button/Button";

interface ExpandableTableProps<T, D> {
  headers: Column<T>[]; //main headers data of type Column
  data: T[]; //full data
  subTableData: keyof T; //sub table data in full data
  subTableHeaders: Column<D>[]; //headers of sub table
  needCheckBox?: boolean;
  title?: string;
}

export default function ExpandableTable<T extends { id: string }, D>({
  headers,
  data,
  subTableData,
  subTableHeaders,
  needCheckBox = true,
  title,
}: ExpandableTableProps<T, D>) {
  const [openRow, setOpenRow] = useState<Record<string, boolean>>({});
  const toggle = (id: string) =>
    setOpenRow((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="overflow-auto rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <h2 className="m-3 text-center font-medium">{title}</h2>
        {needCheckBox && <Button className="m-2 h-10">Confirm</Button>}
      </div>
      <Table className="mb-6">
        {/* Main table headers */}
        <TableHeader className="border-y border-t border-gray-100 bg-gray-200 px-6 py-3.5 dark:border-white/[0.05] dark:bg-gray-950">
          <TableRow>
            <TableCell className="w-0.5" isHeader>
              {" "}
            </TableCell>
            {headers.map((h) => (
              <TableCell
                className="text-theme-sm px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                key={String(h.key)}
                isHeader
              >
                {h.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        {/* Main table Body */}
        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {data.map((row) => {
            const subTable = row[subTableData] as D[];
            return (
              <Fragment key={row.id}>
                {/* Main table row/accordion */}
                <TableRow className="bg-gray-50 dark:bg-gray-900">
                  <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    <button onClick={() => toggle(row.id)}>
                      <FontAwesomeIcon
                        icon={faChevronUp}
                        className={`transition-transform duration-300 ${openRow[row.id] ? "rotate-180" : "rotate-0"}`}
                      />
                    </button>
                  </TableCell>
                  {headers.map((h) => (
                    <TableCell
                      key={String(h.key)}
                      className="text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400"
                    >
                      {h.render
                        ? h.render(row[h.key], row)
                        : String(row[h.key])}
                    </TableCell>
                  ))}
                </TableRow>
                {/* Accordion body */}
                {openRow[row.id] && (
                  <TableRow>
                    <TableCell
                      colspan={headers.length + 1}
                      className="text-theme-sm text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      <Table>
                        {/* Subtable Header */}
                        <TableHeader className="bg-gray-40 border-y border-t border-gray-100 px-6 py-3.5 dark:border-white/[0.05] dark:bg-gray-800">
                          <TableRow>
                            <TableCell className="w-0.5" isHeader>
                              {" "}
                            </TableCell>
                            {subTableHeaders.map((d) => (
                              <TableCell
                                key={String(d.key)}
                                isHeader
                                className="text-theme-sm px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                              >
                                {d.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHeader>
                        {/* Subtable Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                          {subTable.map((subRow, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                                {needCheckBox ? (
                                  <input type="checkbox" name="" id="" />
                                ) : (
                                  " "
                                )}
                              </TableCell>
                              {subTableHeaders.map((d) => (
                                <TableCell
                                  key={String(d.key)}
                                  className="text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400"
                                >
                                  {d.render
                                    ? d.render(subRow[d.key], subRow)
                                    : String(subRow[d.key])}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
