import { Table, TableBody, TableCell, TableRow } from "../ui/table";

export default function OrderSummary() {
  return (
    <div className="rounded-2xl border border-gray-200 p-6">
      <h2 className="mb-4 text-lg">Order Summary</h2>
      <Table>
        <TableBody className="">
          <TableRow className="border-b border-gray-200">
            <TableCell className="py-2">Total Products</TableCell>
            <TableCell className="py-2">4 items</TableCell>
          </TableRow>
          <TableRow className="border-b border-gray-200">
            <TableCell className="py-2">Total Quantity</TableCell>
            <TableCell className="py-2">120 units</TableCell>
          </TableRow>
          <TableRow className="border-b border-gray-200">
            <TableCell className="py-2">Total Value</TableCell>
            <TableCell className="py-2">$1200</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
