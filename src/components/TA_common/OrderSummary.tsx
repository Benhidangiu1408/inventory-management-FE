import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "../../default_components/ui/table";

export default function OrderSummary({
  products,
  quantity,
}: {
  products: number;
  quantity: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-lg">Order Summary</h2>
      <Table>
        <TableBody className="">
          <TableRow className="border-b border-gray-200">
            <TableCell className="py-2">Total Products</TableCell>
            <TableCell className="py-2">{products} items</TableCell>
          </TableRow>
          <TableRow className="border-b border-gray-200">
            <TableCell className="py-2">Total Quantity</TableCell>
            <TableCell className="py-2">{quantity} units</TableCell>
          </TableRow>
          {/* <TableRow className="border-b border-gray-200">
            <TableCell className="py-2">Total Value</TableCell>
            <TableCell className="py-2">$1200</TableCell>
          </TableRow> */}
        </TableBody>
      </Table>
    </div>
  );
}
