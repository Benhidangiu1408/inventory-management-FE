import NewUserForm from "@/components/form/NewUserForm";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";

export default function RegisterUserPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Register User" filters={["admin"]} />
      <div className="default-card p-6">
        <NewUserForm />
      </div>
    </div>
  );
}
