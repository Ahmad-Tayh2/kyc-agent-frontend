import React, { useMemo } from "react";
// import { useForm } from "react-hook-form";
import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRegisterAndUpload } from "@/hooks/data/useAuth";
import {
  useCountries,
  useCitiesByCountry,
  useStatesByCountry,
} from "@/hooks/data/useAddress";
import { useTranslation } from "react-i18next";
import RegistrationSuccessDialog from "./RegistrationSuccessDialog";

import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import UploadIcon from "@/assets/icons/upload-icon.svg?react";
import FileIcon from "@/assets/icons/file-icon.svg?react";
import DatePicker from "@/components/shared/DatePicker";
import SearchableSelect from "@/components/ui/searchable-select";
import PhoneInput from "@/components/shared/PhoneInput";
import { cn } from "@/lib/utils";
import { ArrowRight, X } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import RadioInput from "@/components/shared/RadioInput";
import { ROUTES } from "@/constants/routes";
import { useNavigate } from "react-router-dom";

const schema = z
  .object({
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    dob: z.string().min(1, "Required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    streetName: z.string().min(1, "Required"),
    houseNumber: z.string().min(1, "Required"),
    city: z.string().min(1, "Required"),
    country: z.string().min(1, "Required"),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    extraAddressDetails: z.string().optional(),
    phone: z.string().min(1, "Required"),
    gender: z.enum(["male", "female"]),
    identity: z.any(),
    businessName: z.string().min(1, "Required"),
    businessStreetName: z.string().min(1, "Required"),
    businessHouseNumber: z.string().min(1, "Required"),
    businessPostalCode: z.string().optional(),
    businessExtraAddressDetails: z.string().optional(),
    businessCity: z.string().min(1, "Required"),
    businessCountry: z.string().min(1, "Required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormInputs = z.infer<typeof schema>;

const RegisterForm: React.FC<{
  onBack: () => void;
  onSubmit?: (data: FormInputs) => void;
  step: "partner" | "sales";
  isSendingPartner?: boolean;
  isPayoutPartner?: boolean;
}> = ({
  onBack,
  /*onSubmit,*/ step,
  isSendingPartner = false,
  isPayoutPartner = false,
}) => {
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<FormInputs>({
  //   // resolver: zodResolver(schema),
  //   defaultValues: { gender: "male" },
  // });
  const {
    mutateAsync: registerAndUpload,
    isPending: isRegistratioPending,
    // status,
    error,
  } = useRegisterAndUpload();
  // Form state management
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    password: "",
    confirmPassword: "",
    streetName: "",
    houseNumber: "",
    city: "",
    country: "",
    state: "",
    postalCode: "",
    extraAddressDetails: "",
    phone: "",
    countryCode: "",
    gender: "",
    businessName: "",
    businessStreetName: "",
    businessHouseNumber: "",
    businessPostalCode: "",
    businessExtraAddressDetails: "",
    businessCity: "",
    businessCountry: "",
  });

  const { data: countries = [], isLoading: countriesLoading } = useCountries();
  const { data: cities = [], isLoading: citiesLoading } = useCitiesByCountry(
    formData.country || null,
  );
  const { data: states = [], isLoading: statesLoading } = useStatesByCountry(
    formData.country || null,
  );
  const { data: businessCities = [], isLoading: businessCitiesLoading } =
    useCitiesByCountry(formData.businessCountry || null);

  const countryOptions =
    countries?.map((country) => ({
      value: country.id.toString(),
      label: country.name,
    })) || [];

  const cityOptions =
    cities?.map((city) => ({
      value: city.id.toString(),
      label: city.name,
    })) || [];
  const stateOptions =
    states?.map((state) => ({
      value: state.id.toString(),
      label: state.name,
    })) || [];
  const businessCityOptions =
    businessCities?.map((city) => ({
      value: city.id.toString(),
      label: city.name,
    })) || [];

  // Country phone code options
  const countryPhoneOptions = countries?.map((country: any) => {
    return {
      value: country.phone_code,
      label: country.name,
      code: country.phone_code,
      countryCode: country.iso2,
    };
  });

  const navigate = useNavigate();
  const [identityFiles, setIdentityFiles] = React.useState<File[]>([]);
  const [fileDragOver, setFileDragOver] = React.useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);
  const [registrationResult, setRegistrationResult] = React.useState<{
    registrationStatus: "success" | "partial" | "error";
    uploadStatus?: "success" | "partial" | "error";
    uploadMessage?: string;
    registrationMessages?: string[];
  } | null>(null);
  const couldNavigateToLogin = useMemo(() => {
    return !!registrationResult;
  }, [registrationResult]);

  const areFieldsDisabled = useMemo(() => {
    return (
      registrationResult?.registrationStatus === "success" ||
      isRegistratioPending
    );
  }, [registrationResult, isRegistratioPending]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (filesArray.length <= 2) {
        setIdentityFiles(filesArray);
        // Clear error when user starts typing
        if (errors["identityFiles"]) {
          setErrors((prev) => ({
            ...prev,
            identityFiles: "",
          }));
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length <= 2) {
      setIdentityFiles(droppedFiles);
      // Update the file input if needed
      if (fileRef.current) {
        fileRef.current.files = e.dataTransfer.files;
      }
    }
  };
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  const handleInputChange = (field: string, value: string) => {
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

    // Clear business city when business country changes
    if (field === "businessCountry") {
      setFormData((prev) => ({
        ...prev,
        businessCity: "",
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const [t] = useTranslation("global");

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: Record<string, string> = {};

    if (!formData.firstName)
      newErrors.firstName = t("modules.register.fields.firstName.error");
    if (!formData.lastName)
      newErrors.lastName = t("modules.register.fields.lastName.error");
    if (!formData.dob) newErrors.dob = t("modules.register.fields.dob.error");
    if (!formData.email)
      newErrors.email = t("modules.register.fields.email.error");
    if (!formData.gender)
      newErrors.gender = t("modules.register.fields.email.error");
    if (!formData.password)
      newErrors.password = t("modules.register.fields.password.error");
    if (formData.password.length < 6)
      newErrors.password = t("modules.register.fields.password.minLength");
    if (!formData.confirmPassword)
      newErrors.confirmPassword = t(
        "modules.register.fields.confirmPassword.required",
      );
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = t(
        "modules.register.fields.confirmPassword.error",
      );
    if (!formData.streetName)
      newErrors.streetName = t("modules.register.fields.streetName.error");
    if (!formData.houseNumber)
      newErrors.houseNumber = t("modules.register.fields.houseNumber.error");
    if (!formData.city)
      newErrors.city = t("modules.register.fields.city.error");
    if (!formData.country)
      newErrors.country = t("modules.register.fields.country.error");
    if (!formData.countryCode)
      newErrors.countryCode = t("common.validation.required");
    if (!formData.phone)
      newErrors.phone = t("modules.register.fields.phone.error");

    if (step === "partner") {
      if (!formData.businessName)
        newErrors.businessName = t(
          "modules.register.fields.businessName.error",
        );
      if (!formData.businessStreetName)
        newErrors.businessStreetName = t(
          "modules.register.fields.businessStreetName.error",
        );
      if (!formData.businessHouseNumber)
        newErrors.businessHouseNumber = t(
          "modules.register.fields.businessHouseNumber.error",
        );
      if (!formData.businessCity)
        newErrors.businessCity = t(
          "modules.register.fields.businessCity.error",
        );
      if (!formData.businessCountry)
        newErrors.businessCountry = t(
          "modules.register.fields.businessCountry.error",
        );
    }
    if (!identityFiles?.length) {
      newErrors.identityFiles = "This field is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let payload: any = {
      user: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        country_phone_code: formData.countryCode,
        phone_number: formData.phone,
        address: {
          street_name: formData.streetName,
          house_number: formData.houseNumber,
          country_id: formData.country,
          city_id: formData.city,
          state_id: formData.state || "",
          extra_address_details: formData.extraAddressDetails || "",
          postal_code: formData.postalCode || "",
        },
      },

      agent_type: step === "partner" ? "business_partner" : "sales_person",
      is_sending_partner: isSendingPartner,
      is_payout_partner: isPayoutPartner,
      date_of_birth: formData.dob,
      gender: formData.gender,
    };
    if (step === "partner") {
      payload = {
        ...payload,

        business_details: {
          business_name: formData.businessName,
          address: {
            street_name: formData.businessStreetName,
            house_number: formData.businessHouseNumber,
            postal_code: formData.businessPostalCode,
            extra_address_details: formData.businessExtraAddressDetails,
            country_id: formData.businessCountry,
            city_id: formData.businessCity,
          },
        },
      };
    }
    try {
      const result = await registerAndUpload({ payload, files: identityFiles });
      // Determine registration and upload status
      type ErrorsMap = Record<string, any[]>; // example: { "user.email": ["Invalid email"], "user.name": ["Required"] }

      function flattenErrors(registration: {
        errors: ErrorsMap;
      }): Array<string> {
        const result: Array<string> = [];

        for (const field in registration.errors) {
          if (
            Object.prototype.hasOwnProperty.call(registration.errors, field)
          ) {
            const messages = registration.errors[field];
            for (const msg of messages) {
              result.push(msg);
            }
          }
        }

        return result;
      }
      const registrationStatus: "success" | "partial" | "error" = "success";
      let uploadStatus: "success" | "partial" | "error" = "success";
      let uploadMessage: string | undefined;
      let registrationMessages: string[] = [];
      if (result?.registration?.status === false) {
        result?.registration?.errors?.values?.map(
          (value: string[]) =>
            (registrationMessages = [...registrationMessages, ...value]),
        );
        const flattened = flattenErrors(result?.registration);

        setRegistrationResult({
          registrationStatus: "error",
          registrationMessages: flattened,
        });
      } else {
        // Check if files were provided and if upload was successful
        if (identityFiles.length === 0) {
          uploadStatus = "partial";
          uploadMessage =
            "No identity files were provided during registration.";
        } else if (result.upload && result.upload.status) {
          uploadStatus = "success";
        } else if (result.upload && !result.upload.status) {
          uploadStatus = "error";
          uploadMessage =
            result.upload.message ||
            "File upload failed. You can add identity files later in your profile.";
        } else {
          uploadStatus = "partial";
          uploadMessage =
            "File upload status unclear. You can add identity files later in your profile.";
        }

        setRegistrationResult({
          registrationStatus,
          uploadStatus,
          uploadMessage,
        });
      }

      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Registration error in form:", error);
      setRegistrationResult({
        registrationStatus: "error",
        uploadStatus: "error",
        uploadMessage: "Registration failed. Please try again.",
      });
      setShowSuccessDialog(true);
    }
  };
  const handleDateChange = (date: string) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        dob: date,
      }));
      if (errors.dob) {
        setErrors((prev) => ({
          ...prev,
          dob: "",
        }));
      }
    }
  };
  return (
    <form
      onSubmit={onFormSubmit}
      className={cn(
        "mx-auto relative pb-5",
        step === "sales" && "my-15",
        "mb-10",
      )}
    >
      <button
        type="button"
        onClick={onBack}
        className="text-primary absolute left-[-40px] top-1 cursor-pointer"
      >
        <BackArrowIcon width={30} height={30} />
      </button>
      <h1 className="text-3xl font-bold mb-2">
        {step === "sales"
          ? t("modules.register.salesTitle")
          : step === "partner" && t("modules.register.partnerTitle")}
      </h1>
      <p className="mb-4 text-[18px]">
        {t("modules.register.requiredDetails")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-5">
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.register.fields.firstName.label")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            // {...register("firstName")}
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            placeholder={t("modules.register.fields.firstName.placeholder")}
            disabled={areFieldsDisabled}
          />
          {errors.firstName && (
            <span className="text-destructive text-xs">{errors.firstName}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.register.fields.lastName.label")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder={t("modules.register.fields.lastName.placeholder")}
            disabled={areFieldsDisabled}
          />
          {errors.lastName && (
            <span className="text-destructive text-xs">{errors.lastName}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.register.fields.email.label")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder={t("modules.register.fields.email.placeholder")}
            disabled={areFieldsDisabled}
          />
          {errors.email && (
            <span className="text-destructive text-xs">{errors.email}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.register.fields.phone.label")}
            <span className="text-red-500">*</span>
          </Label>
          <PhoneInput
            placeholder={t("modules.register.fields.phone.placeholder")}
            countryOptions={countryPhoneOptions || []}
            selectedCountry={formData.countryCode}
            phoneNumber={formData.phone}
            onCountryChange={(countryCode) => {
              handleInputChange("countryCode", countryCode);
              // Clear the phone number when country changes to let the PhoneInput component handle it
              handleInputChange("phone", "");
            }}
            onPhoneChange={(phoneNumber) =>
              handleInputChange("phone", phoneNumber)
            }
            error={errors.countryCode || errors.phone}
            disabled={areFieldsDisabled}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.register.fields.password.label")}
            <span className="text-red-500">*</span>
          </Label>
          <PasswordInput
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder={t("modules.register.fields.password.placeholder")}
            disabled={areFieldsDisabled}
          />

          {errors.password && (
            <span className="text-destructive text-xs">{errors.password}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.register.fields.confirmPassword.label")}
            <span className="text-red-500">*</span>
          </Label>
          <PasswordInput
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            placeholder={t(
              "modules.register.fields.confirmPassword.placeholder",
            )}
            disabled={areFieldsDisabled}
          />
          {errors.confirmPassword && (
            <span className="text-destructive text-xs">
              {errors.confirmPassword}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.register.fields.streetName.label")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.streetName}
            onChange={(e) => handleInputChange("streetName", e.target.value)}
            placeholder={t("modules.register.fields.streetName.placeholder")}
            disabled={areFieldsDisabled}
          />
          {errors.streetName && (
            <span className="text-destructive text-xs">
              {errors.streetName}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.register.fields.houseNumber.label")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.houseNumber}
            onChange={(e) => handleInputChange("houseNumber", e.target.value)}
            placeholder={t("modules.register.fields.houseNumber.placeholder")}
            disabled={areFieldsDisabled}
          />
          {errors.houseNumber && (
            <span className="text-destructive text-xs">
              {errors.houseNumber}
            </span>
          )}
        </div>
        <SearchableSelect
          label={t("modules.register.fields.country.label")}
          placeholder={t("modules.register.fields.country.placeholder")}
          options={countryOptions}
          value={formData.country}
          onChange={(value) => handleInputChange("country", value.toString())}
          error={errors.country}
          loading={countriesLoading}
          required
          disabled={areFieldsDisabled}
        />

        <SearchableSelect
          label={t("modules.register.fields.city.label")}
          placeholder={t("modules.register.fields.city.placeholder")}
          options={cityOptions}
          value={formData.city}
          onChange={(value) => handleInputChange("city", value.toString())}
          error={errors.city}
          loading={citiesLoading}
          disabled={!formData.country || areFieldsDisabled}
          required
        />
        <SearchableSelect
          label={t("modules.register.fields.state.label")}
          placeholder={t("modules.register.fields.state.placeholder")}
          options={stateOptions}
          value={formData.state}
          onChange={(value) => handleInputChange("state", value.toString())}
          error={errors.state}
          loading={statesLoading}
          disabled={!formData.country || areFieldsDisabled}
        />
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.register.fields.postalCode.label")}
          </Label>
          <Input
            value={formData.postalCode}
            onChange={(e) => handleInputChange("postalCode", e.target.value)}
            placeholder={t("modules.register.fields.postalCode.placeholder")}
            disabled={areFieldsDisabled}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.register.fields.extraAddressDetails.label")}
          </Label>
          <Input
            value={formData.extraAddressDetails}
            onChange={(e) =>
              handleInputChange("extraAddressDetails", e.target.value)
            }
            placeholder={t(
              "modules.register.fields.extraAddressDetails.placeholder",
            )}
            disabled={areFieldsDisabled}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.register.fields.dob.label")}
            <span className="text-red-500">*</span>
          </Label>
          {/* <Input type="date" {...register("dob")} placeholder="DD/MM/YY" /> */}
          <DatePicker
            value={formData.dob}
            onChange={handleDateChange}
            disabled={areFieldsDisabled}
            disabledAfter={new Date()}
          />

          {errors.dob && (
            <span className="text-destructive text-xs">{errors.dob}</span>
          )}
        </div>

        <div className="md:col-span-2 flex flex-col gap-2">
          <Label>
            {t("modules.register.fields.gender.label")}
            <span className="text-red-500">*</span>
          </Label>

          <RadioInput
            options={genderOptions}
            selectedValue={formData.gender}
            onSelectValue={(value: string) =>
              handleInputChange("gender", value)
            }
            disabled={areFieldsDisabled}
          />
          {errors.gender && (
            <span className="text-destructive text-xs">{errors.gender}</span>
          )}
        </div>
        <div className="md:col-span-2 flex flex-col gap-2">
          <Label>
            {t("modules.register.fields.identity.label")}
            <span className="text-red-500">*</span>
          </Label>

          <div
            className="h-20 border cursor-pointer rounded-lg hover:bg-gray-50 transition"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            {fileDragOver ? (
              <div className="bg-primary/8 p-1 border-2 border-primary border-dashed rounded-lg w-full h-full flex flex-col items-center justify-center gap-1">
                <UploadIcon width={90} />
                <div className="text-sm font-600 text-primary">
                  {t("modules.register.fields.identity.dragDropText")}
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  "border-gray-300 px-2 rounded-lg w-full h-full flex items-center gap-2",
                  areFieldsDisabled &&
                    "cursor-not-allowed bg-[#E5E5E5] text-[#101828] opacity-50",
                )}
              >
                <UploadIcon width={90} />

                <span className="text-md text-muted-foreground">
                  <span className="text-primary font-medium">
                    {t("modules.register.fields.identity.clickToUpload")}
                  </span>{" "}
                  {t("modules.register.fields.identity.fileTypes")}
                </span>
              </div>
            )}
            {/* Hidden file input */}
            <Input
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={handleFileChange}
              className="hidden"
              ref={fileRef}
              disabled={areFieldsDisabled}
            />
          </div>
          {errors.identityFiles && (
            <span className="text-destructive text-xs">
              {errors.identityFiles}
            </span>
          )}
          {identityFiles?.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 border border-[#656565] rounded-md p-2 mt-2"
            >
              <span>
                {/* You can use an icon here */}
                <FileIcon color="var(--primary)" />
              </span>
              <div>
                <div className="font-medium">{file.name}</div>
                <div className="text-xs text-[#656565]">
                  {(file.size / 1024).toFixed(0)}{" "}
                  {t("modules.register.fields.identity.fileSize")}
                </div>
              </div>
              {/* Optional: Remove button */}
              {!areFieldsDisabled && (
                <button
                  type="button"
                  className="mb-auto ml-auto text-red-500 cursor-pointer"
                  onClick={() => {
                    setIdentityFiles((files) =>
                      files.filter((_, i) => i !== idx),
                    );
                    if (fileRef.current) {
                      fileRef.current.value = "";
                    }
                  }}
                >
                  <X width={22} height={22} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {step === "partner" && (
        <div>
          <Separator className="my-8" />
          <div className="mt-8 mb-2 text-lg font-semibold">
            {t("modules.register.businessDetails")}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-5">
            <div className="flex flex-col gap-1 md:col-span-2">
              <Label className="text-[14px]">
                {t("modules.register.fields.businessName.label")}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.businessName}
                onChange={(e) =>
                  handleInputChange("businessName", e.target.value)
                }
                placeholder={t(
                  "modules.register.fields.businessName.placeholder",
                )}
                disabled={areFieldsDisabled}
              />
              {errors.businessName && (
                <span className="text-destructive text-xs">
                  {errors.businessName}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[14px]">
                {t("modules.register.fields.businessStreetName.label")}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.businessStreetName}
                onChange={(e) =>
                  handleInputChange("businessStreetName", e.target.value)
                }
                placeholder={t(
                  "modules.register.fields.businessStreetName.placeholder",
                )}
                disabled={areFieldsDisabled}
              />
              {errors.businessStreetName && (
                <span className="text-destructive text-xs">
                  {errors.businessStreetName}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[14px]">
                {t("modules.register.fields.businessHouseNumber.label")}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.businessHouseNumber}
                onChange={(e) =>
                  handleInputChange("businessHouseNumber", e.target.value)
                }
                placeholder={t(
                  "modules.register.fields.businessHouseNumber.placeholder",
                )}
                disabled={areFieldsDisabled}
              />
              {errors.businessHouseNumber && (
                <span className="text-destructive text-xs">
                  {errors.businessHouseNumber}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[14px]">
                {t("modules.register.fields.businessPostalCode.label")}
              </Label>
              <Input
                value={formData.businessPostalCode}
                onChange={(e) =>
                  handleInputChange("businessPostalCode", e.target.value)
                }
                placeholder={t(
                  "modules.register.fields.businessPostalCode.placeholder",
                )}
                disabled={areFieldsDisabled}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[14px]">
                {t("modules.register.fields.businessExtraAddressDetails.label")}
              </Label>
              <Input
                value={formData.businessExtraAddressDetails}
                onChange={(e) =>
                  handleInputChange(
                    "businessExtraAddressDetails",
                    e.target.value,
                  )
                }
                placeholder={t(
                  "modules.register.fields.businessExtraAddressDetails.placeholder",
                )}
                disabled={areFieldsDisabled}
              />
            </div>
            <SearchableSelect
              label={t("modules.register.fields.businessCountry.label")}
              placeholder={t(
                "modules.register.fields.businessCountry.placeholder",
              )}
              options={countryOptions}
              value={formData.businessCountry}
              onChange={(value) =>
                handleInputChange("businessCountry", value.toString())
              }
              error={errors.businessCountry}
              loading={countriesLoading}
              required
              disabled={areFieldsDisabled}
            />
            <SearchableSelect
              label={t("modules.register.fields.businessCity.label")}
              placeholder={t(
                "modules.register.fields.businessCity.placeholder",
              )}
              options={businessCityOptions}
              value={formData.businessCity}
              onChange={(value) =>
                handleInputChange("businessCity", value.toString())
              }
              error={errors.businessCity}
              loading={businessCitiesLoading}
              disabled={!formData.businessCountry || areFieldsDisabled}
              required
            />
          </div>
        </div>
      )}

      {registrationResult?.registrationStatus !== "success" && (
        <div
          className="flex gap-4 mt-6"
          style={{
            marginBottom: "20px",
          }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isRegistratioPending}
          >
            {t("common.buttons.cancel")}
          </Button>
          <Button type="submit" disabled={isRegistratioPending}>
            {t("common.buttons.register")}
          </Button>
        </div>
      )}
      {couldNavigateToLogin && (
        <Button
          onClick={() => navigate(ROUTES.AUTH.LOGIN)}
          className="w-full my-5"
          disabled={isRegistratioPending}
        >
          {t("modules.register.success.goToLogin")}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}

      {error && (
        <div className="text-destructive text-sm mt-2">
          {(error as Error).message}
        </div>
      )}
      {/* Registration Success Dialog */}
      {registrationResult && (
        <RegistrationSuccessDialog
          isOpen={showSuccessDialog}
          onClose={() => setShowSuccessDialog(false)}
          registrationStatus={registrationResult.registrationStatus}
          registrationMessages={registrationResult.registrationMessages}
          uploadStatus={registrationResult.uploadStatus}
          uploadMessage={registrationResult.uploadMessage}
          userEmail={formData.email}
        />
      )}
    </form>
  );
};

export default RegisterForm;
