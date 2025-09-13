export default function GeneralInformation() {
  return (
    <div className="rounded-2xl border border-gray-200 p-6">
      <div className="mb-3">General Information</div>
      <div className="grid grid-cols-2 gap-5">
        <div className="text-sm">
          <div className="font-medium text-gray-600">Stock-in Code</div>
          <p>SI-2025-001</p>
        </div>
        <div className="text-sm">
          <div className="font-medium text-gray-600">Stock-in Date</div>
          <p>2025-01-01</p>
        </div>
        <div className="text-sm">
          <div className="font-medium text-gray-600">Stock-in By</div>
          <p>John Doe</p>
        </div>
        <div className="text-sm">
          <div className="font-medium text-gray-600">Supplier</div>
          <p>Supplier 1</p>
        </div>
      </div>
    </div>
  );
}
