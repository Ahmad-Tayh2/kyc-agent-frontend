import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import PageTitle from "@/components/PageTitle";
import StatusLabel from "@/components/StatusLabel";
import CustomerSectionCard from "./CustomerSectionCard";
import { useGetCustomer, useUpdateCustomer } from "@/hooks/useCustomers";

const CustomerEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetCustomer(id!);
  const [formData, setFormData] = useState<any>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const { mutateAsync: updateCustomer, isPending: isUpdateCustomerPending } =
    useUpdateCustomer(id!);

  useEffect(() => {
    if (data && data.data) {
      setFormData({
        country: data.data?.country.id,
        city: data.data?.city.id,
        postalCode: data.data.postal_code,
        firstName: data.data.first_name,
        lastName: data.data.last_name,
        dateOfBirth: data.data.date_of_birth,
        gender: data.data.gender,
        streetName: data.data.street_name,
        houseNumber: data.data.house_number,
        phoneNumber: data.data.phone_number,
        countryPhoneCode: data.data.country_phone_code,
        status: data.data.status,
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
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        country_id: formData.country,
        city_id: formData.city,
        street_name: formData.streetName,
        house_number: formData.houseNumber,
        postal_code: formData.postalCode,
        phone_number: formData.phoneNumber,
        country_phone_code: formData.countryPhoneCode,
        status: formData.status,
      };
      await updateCustomer(payloadToUpdate);
      setShowSuccess(true);
    } catch (e) {
      // handle error
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error)
    return <div className="p-8 text-red-500">Error loading customer.</div>;

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
            title={`${formData.firstName || ""} ${formData.lastName || ""}`}
          />
          <StatusLabel
            value={formData.status || "active"}
            color="#ff0000"
            className="rounded-full"
          />
        </div>
        {formData.created_at && (
          <div className="ml-10">
            Registered on: {new Date(formData.created_at).toLocaleDateString()}
          </div>
        )}
      </div>
      <CustomerSectionCard
        formData={formData}
        onChange={handleInputChange}
        onDateChange={handleDateChange}
        onSave={handleSave}
        loading={isUpdateCustomerPending}
      />
      {showSuccess && (
        <div className="p-4 text-green-600">Customer updated successfully!</div>
      )}
    </div>
  );
};

export default CustomerEditPage;
