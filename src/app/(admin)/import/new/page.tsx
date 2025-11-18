import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import Button from "@/default_components/ui/button/Button";
import {
  faArrowRightArrowLeft,
  faDollarSign,
  faHandPointer,
  faIndustry,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function NewImportPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="New Import" />
      <div className="rounded-2xl border border-gray-200">
        <div className="flex items-center justify-center gap-3 border-b border-gray-200 p-6 text-xl font-bold">
          <FontAwesomeIcon icon={faHandPointer} />
          <h2>Please Choose Your Type Of Export</h2>
        </div>
        <div className="flex flex-col items-center gap-3 p-6">
          <Link
            className="w-[50%]"
            href="/import/process/manufacturer/1/quantity-check"
          >
            <Button className="w-full gap-3 p-6">
              <FontAwesomeIcon icon={faIndustry} />
              <h3>Manufacturer</h3>
            </Button>
          </Link>
          <Link
            className="w-[50%]"
            href="/import/process/transfer/1/quantity-check"
          >
            <Button className="w-full gap-3 p-6">
              <FontAwesomeIcon icon={faArrowRightArrowLeft} />
              <h3>Transfer</h3>
            </Button>
          </Link>
          <Link
            className="w-[50%]"
            href="/import/process/purchase-order/1/quantity-check"
          >
            <Button className="w-full gap-3 p-6">
              <FontAwesomeIcon icon={faDollarSign} />
              <h3>Purchase Order</h3>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
