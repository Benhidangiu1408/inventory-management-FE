import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";

export default function ProductPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Product" filters={["catalog"]} />
      <div>
        <div className="default-card p-6"></div>
      </div>
    </div>
  );
}
