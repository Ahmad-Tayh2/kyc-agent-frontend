import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import PageTitle from "@/components/shared/PageTitle";
import StatusLabel from "@/components/shared/StatusLabel";
import { useGetCustomer, useUpdateCustomer } from "@/hooks/data/useCustomers";
import { CUSTOMER_STATUS_COLORS } from "@/constants/appConstants";
import EditSectionCard from "@/components/shared/EditSectionCard";
import CustomerBasicDetails from "../CustomerCreatePage/components/CustomerBasicDetails";

const CustomerEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetCustomer(id!);
  const [formData, setFormData] = useState<any>({});
  const [basicInfoEditMode, setBasicInfoEditMode] = React.useState(false);

  const { mutateAsync: updateCustomer, isPending: isUpdateCustomerPending } =
    useUpdateCustomer(id!);

  useEffect(() => {
    if (data && data.data) {
      setFormData({
        country_id: data.data?.country.id,
        city_id: data.data?.city.id,
        postal_code: data.data.postal_code,
        first_name: data.data.first_name,
        last_name: data.data.last_name,
        date_of_birth: data.data.date_of_birth,
        gender: data.data.gender,
        street_name: data.data.street_name,
        house_number: data.data.house_number,
        phone_number: data.data.phone_number,
        country_phone_code: data.data.country_phone_code,
        status: data.data.status,
        created_at: data.data.created_at,
      });
    }
  }, [data]);

  const handleBack = () => {
    navigate(ROUTES.CUSTOMERS.LIST);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const payloadToUpdate: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        country_id: formData.country_id,
        city_id: formData.city_id,
        street_name: formData.street_name,
        house_number: formData.house_number,
        postal_code: formData.postal_code,
        phone_number: formData.phone_number,
        country_phone_code: formData.country_phone_code,
        status: formData.status,
      };
      await updateCustomer(payloadToUpdate);
    } catch (e) {
      // handle error
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error)
    return <div className="p-8 text-red-500">Error loading customer.</div>;

  const statusColor =
    CUSTOMER_STATUS_COLORS[
      formData.status as keyof typeof CUSTOMER_STATUS_COLORS
    ] || "#000000";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="">
        <div className="flex justify-start items-center gap-3">
          <button
            onClick={handleBack}
            className="text-primary top-1 cursor-pointer"
          >
            <BackArrowIcon width={30} height={30} />
          </button>
          <PageTitle
            title={`${formData.first_name || ""} ${formData.last_name || ""}`}
          />
          <StatusLabel
            value={formData.status || "active"}
            color={statusColor}
            className="rounded-full"
          />
        </div>
        {formData.created_at && (
          <div className="ml-10">
            Registered on: {new Date(formData.created_at).toLocaleDateString()}
          </div>
        )}
      </div>
      <EditSectionCard
        sectionTitle="Customer Bio"
        onSave={handleSave}
        loading={isUpdateCustomerPending}
        editMode={basicInfoEditMode}
        setEditMode={setBasicInfoEditMode}
      >
        <CustomerBasicDetails
          formData={formData}
          handleInputChange={handleInputChange}
          handleDateChange={handleDateChange}
          editMode={basicInfoEditMode}
        />
      </EditSectionCard>
    </div>
  );
};

export default CustomerEditPage;
