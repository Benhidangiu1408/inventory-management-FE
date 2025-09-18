import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import {
  faArrowRightArrowLeft,
  faHandPointer,
  faIndustry,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function NewExportPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="New Export" />
      <div className="rounded-2xl border border-gray-200">
        <div className="flex items-center justify-center gap-3 border-b border-gray-200 p-6 text-xl font-bold">
          <FontAwesomeIcon icon={faHandPointer} />
          <h2>Please Choose Your Type Of Export</h2>
        </div>
        <div className="flex flex-col items-center gap-3 p-6">
          <Link
            className="w-[50%]"
            href="/export/process/manufacturer/1/confirm"
          >
            <Button className="w-full gap-3 p-6">
              <FontAwesomeIcon icon={faIndustry} />
              <h3>Manufacturer</h3>
            </Button>
          </Link>
          <Link className="w-[50%]" href="/export/process/transfer/1/confirm">
            <Button className="w-full gap-3 p-6">
              <FontAwesomeIcon icon={faArrowRightArrowLeft} />
              <h3>Transfer</h3>
            </Button>
          </Link>
          <Link className="w-[50%]" href="/export/process/customer/1/confirm">
            <Button className="w-full gap-3 p-6">
              <FontAwesomeIcon icon={faUser} />
              <h3>Customer</h3>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
