import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCustomer } from "@/hooks/useCustomerCreation";
import { useCountries, useCitiesByCountry } from "@/hooks/useAddress";
import PhoneInput from "@/components/PhoneInput";
import DatePicker from "@/components/DatePicker";
import { ROUTES } from "@/constants/routes";
import { ArrowLeft, CheckCircle, AlertCircle, Upload } from "lucide-react";
import type { CustomerCreateData } from "@/services/customers";
import CustomerSuccessModal from "@/components/customers/CustomerSuccessModal";

type FormStep = "basic" | "identity" | "income";

const CustomerCreateFormPage: React.FC = () => {
  // const [t] = useTranslation("global");
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<FormStep>("basic");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<Partial<CustomerCreateData>>({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    streetName: "",
    city: "",
    postalCode: "",
    country: "",
    gender: "male",
    phoneNumber: "",
    countryCode: "",
  });

  const { mutateAsync: createCustomer, isPending: isCreating } =
    useCreateCustomer();
  const { data: countries = [] } = useCountries();
  const { data: cities = [] } = useCitiesByCountry(formData.country || null);

  const countryOptions =
    countries?.map((country: any) => ({
      value: country.id.toString(),
      label: country.name,
    })) || [];

  const cityOptions =
    cities?.map((city: any) => ({
      value: city.id.toString(),
      label: city.name,
    })) || [];

  const countryPhoneOptions =
    countries?.map((country: any) => ({
      value: country.phone_code,
      label: country.name,
      code: country.phone_code,
      countryCode: country.iso2,
    })) || [];

  const handleInputChange = (
    field: keyof CustomerCreateData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear city when country changes
    if (field === "country") {
      setFormData((prev) => ({
        ...prev,
        city: "",
      }));
    }
  };

  const handleDateChange = (field: keyof CustomerCreateData, date: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleNext = () => {
    if (currentStep === "basic") {
      setCurrentStep("identity");
    } else if (currentStep === "identity") {
      setCurrentStep("income");
    }
  };

  const handleBack = () => {
    if (currentStep === "identity") {
      setCurrentStep("basic");
    } else if (currentStep === "income") {
      setCurrentStep("identity");
    }
  };

  const handleSubmit = async () => {
    try {
      await createCustomer(formData as CustomerCreateData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to create customer:", error);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.CUSTOMERS);
  };

  const handleSuccessContinue = () => {
    setShowSuccessModal(false);
    navigate(ROUTES.CUSTOMERS);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div
          className={`flex items-center ${
            currentStep === "basic" ? "text-teal-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep === "basic"
                ? "bg-teal-600 border-teal-600 text-white"
                : "border-gray-300"
            }`}
          >
            {currentStep === "basic" ? (
              "1"
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
          </div>
          <span className="ml-2 font-medium">Basic Details</span>
        </div>

        <div
          className={`w-16 h-0.5 ${
            currentStep === "income" ? "bg-teal-600" : "bg-gray-300"
          }`}
        ></div>

        <div
          className={`flex items-center ${
            currentStep === "identity"
              ? "text-teal-600"
              : currentStep === "income"
              ? "text-teal-600"
              : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep === "identity"
                ? "bg-teal-600 border-teal-600 text-white"
                : currentStep === "income"
                ? "border-teal-600 text-teal-600"
                : "border-gray-300"
            }`}
          >
            {currentStep === "income" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              "2"
            )}
          </div>
          <span className="ml-2 font-medium">Customer Identity</span>
        </div>

        <div
          className={`w-16 h-0.5 ${
            currentStep === "income" ? "bg-teal-600" : "bg-gray-300"
          }`}
        ></div>

        <div
          className={`flex items-center ${
            currentStep === "income" ? "text-teal-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep === "income"
                ? "bg-teal-600 border-teal-600 text-white"
                : "border-gray-300"
            }`}
          >
            3
          </div>
          <span className="ml-2 font-medium">Proof of Income</span>
        </div>
      </div>
    </div>
  );

  const renderBasicDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            placeholder="First Name"
            value={formData.firstName || ""}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            placeholder="Last Name"
            value={formData.lastName || ""}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="The email must be verified"
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <DatePicker
            value={formData.dateOfBirth || ""}
            onChange={(date: string) => handleDateChange("dateOfBirth", date)}
          />
        </div>

        <div>
          <Label htmlFor="streetName">Street Name and House Number *</Label>
          <Input
            id="streetName"
            placeholder="Enter street name and house number"
            value={formData.streetName || ""}
            onChange={(e) => handleInputChange("streetName", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="city">City *</Label>
          <Select
            value={formData.city || ""}
            onValueChange={(value: string) => handleInputChange("city", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Enter your city name" />
            </SelectTrigger>
            <SelectContent>
              {cityOptions.map((city) => (
                <SelectItem key={city.value} value={city.value}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="postalCode">Postal Code *</Label>
          <Input
            id="postalCode"
            placeholder="Enter your postal code"
            value={formData.postalCode || ""}
            onChange={(e) => handleInputChange("postalCode", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="country">Country *</Label>
          <Select
            value={formData.country || ""}
            onValueChange={(value: string) =>
              handleInputChange("country", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Enter your country" />
            </SelectTrigger>
            <SelectContent>
              {countryOptions.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Gender</Label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={(e) =>
                  handleInputChange(
                    "gender",
                    e.target.value as "male" | "female"
                  )
                }
                className="w-4 h-4 text-teal-600"
              />
              <span>Male</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={(e) =>
                  handleInputChange(
                    "gender",
                    e.target.value as "male" | "female"
                  )
                }
                className="w-4 h-4 text-teal-600"
              />
              <span>Female</span>
            </label>
          </div>
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <PhoneInput
            placeholder="Enter your phone number"
            countryOptions={countryPhoneOptions}
            selectedCountry={formData.countryCode || ""}
            phoneNumber={formData.phoneNumber || ""}
            onCountryChange={(countryCode: string) =>
              handleInputChange("countryCode", countryCode)
            }
            onPhoneChange={(phoneNumber: string) =>
              handleInputChange("phoneNumber", phoneNumber)
            }
          />
        </div>
      </div>
    </div>
  );

  const renderCustomerIdentity = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <p className="text-red-700 text-sm">
            This is not mandatory at the moment. You can fill them later.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="documentType">Document Type</Label>
          <Select
            value={formData.documentType || ""}
            onValueChange={(value: string) =>
              handleInputChange("documentType", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="national_id">National ID</SelectItem>
              <SelectItem value="drivers_license">Driver's License</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="documentNumber">Document Number</Label>
          <Input
            id="documentNumber"
            placeholder="Enter document number"
            value={formData.documentNumber || ""}
            onChange={(e) =>
              handleInputChange("documentNumber", e.target.value)
            }
          />
        </div>

        <div>
          <Label htmlFor="documentIssueDate">Document Issue Date</Label>
          <DatePicker
            value={formData.documentIssueDate || ""}
            onChange={(date: string) =>
              handleDateChange("documentIssueDate", date)
            }
          />
        </div>

        <div>
          <Label htmlFor="documentExpiryDate">Document Expiry Date</Label>
          <DatePicker
            value={formData.documentExpiryDate || ""}
            onChange={(date: string) =>
              handleDateChange("documentExpiryDate", date)
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label>Upload the front face of your ID</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-teal-600 font-medium">Upload document</p>
            <p className="text-sm text-gray-500">
              Drag or click here to upload your document
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Upload the back face of your ID</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-teal-600 font-medium">Upload document</p>
            <p className="text-sm text-gray-500">
              Drag or click here to upload your document
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProofOfIncome = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <p className="text-red-700 text-sm">
            This is not mandatory at the moment. You can fill them later.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label>Upload Recent Three Months Bank Statements</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-teal-600 font-medium">Upload Bank statement</p>
            <p className="text-sm text-gray-500">
              Drag or click here to upload your document
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>
              Upload Extra Documents of other income with description
            </Label>
            <AlertCircle className="h-4 w-4 text-gray-400" />
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-teal-600 font-medium">Upload extra document</p>
            <p className="text-sm text-gray-500">
              Drag or click here to upload your document
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Add New Customer</h1>
      </div>

      <p className="text-gray-600">Add new customer details here.</p>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Form Content */}
      <div className="bg-white rounded-lg border p-6">
        {currentStep === "basic" && renderBasicDetails()}
        {currentStep === "identity" && renderCustomerIdentity()}
        {currentStep === "income" && renderProofOfIncome()}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        {currentStep === "identity" && (
          <Button variant="outline" onClick={handleBack}>
            SKIP STEP
          </Button>
        )}

        <Button variant="outline" onClick={handleCancel}>
          CANCEL
        </Button>

        {currentStep === "income" ? (
          <Button
            onClick={handleSubmit}
            disabled={isCreating}
            className="bg-teal-600 hover:bg-teal-700"
          >
            SAVE & CONTINUE
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="bg-teal-600 hover:bg-teal-700"
          >
            SAVE & CONTINUE
          </Button>
        )}
      </div>

      {/* Success Modal */}
      <CustomerSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onContinue={handleSuccessContinue}
      />
    </div>
  );
};

export default CustomerCreateFormPage;
