import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRegister } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import UncheckedIcon from "@/assets/icons/unchecked-icon.svg?react";
import CheckedIcon from "@/assets/icons/checked-icon.svg?react";
import UploadIcon from "@/assets/icons/upload-icon.svg?react";
import DatePicker from "@/components/ui/DatePicker";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  dob: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  country: z.string().min(1, "Required"),
  state: z.string().optional(),
  phone: z.string().min(1, "Required"),
  gender: z.enum(["male", "female"]),
  identity: z.any(),
  businessName: z.string().min(1, "Required"),
  businessAddress: z.string().min(1, "Required"),
  businessCity: z.string().min(1, "Required"),
  businessCountry: z.string().min(1, "Required"),
});

type FormInputs = z.infer<typeof schema>;

interface FormData {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
}

interface FormFieldProps {
  label: string;
  name: keyof FormData;
  type?: string;
  placeholder?: string;
  register: any;
  error?: any;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
}) => (
  <div className="flex flex-col gap-1 mb-4">
    <Label className="text-[14px] font-medium">
      {label}
      <span className="text-red-500">*</span>
    </Label>
    <Input
      type={type}
      placeholder={placeholder}
      {...register(name)}
      className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
    />

    {error && <span className="text-destructive text-xs">{error.message}</span>}
  </div>
);

const RegisterForm: React.FC<{
  onBack: () => void;
  onSubmit?: (data: FormInputs) => void;
  step: "partner" | "sales";
}> = ({ onBack, /*onSubmit,*/ step }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    // resolver: zodResolver(schema),
    defaultValues: { gender: "male" },
  });

  const [selectedGender, setSelectedGender] = React.useState<any>(null);

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  const fileRef = React.useRef<HTMLInputElement | null>(null);

  // const handleClick = () => {
  //   fileRef.current?.click();
  // };

  // const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //   // handle files
  //   const files = e.dataTransfer.files;
  //   // manually trigger input change if needed
  // };

  const { mutateAsync: registerAsync, status, error } = useRegister();
  const navigate = useNavigate();

  const onFormSubmit = async (data: FormInputs) => {
    try {
      await registerAsync(data);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      // error is handled by React Query's error state
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className={cn("mx-auto relative", step === "sales" && "my-20")}
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
          ? "Register as a Sales Person"
          : step === "partner" && "Register As Business Partner"}
      </h1>
      <p className="mb-4 text-[18px]">Required Details For Registration</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-7">
        <FormField
          label={"First Name"}
          name={"firstName"}
          type={"text"}
          placeholder={"Enter your first name"}
          register={register}
          error={errors.firstName}
        />
        {/* <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            First Name<span className="text-red-500">*</span>
          </Label>
          <Input
            {...register("firstName")}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <span className="text-destructive text-xs">
              {errors.firstName.message}
            </span>
          )}
        </div> */}
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            Last Name<span className="text-red-500">*</span>
          </Label>
          <Input {...register("lastName")} placeholder="Enter your last name" />
          {errors.lastName && (
            <span className="text-destructive text-xs">
              {errors.lastName.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            Date of Birth<span className="text-red-500">*</span>
          </Label>
          {/* <Input type="date" {...register("dob")} placeholder="DD/MM/YY" /> */}
          <DatePicker />
          {errors.dob && (
            <span className="text-destructive text-xs">
              {errors.dob.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            Email<span className="text-red-500">*</span>
          </Label>
          <Input
            type="email"
            {...register("email")}
            placeholder="Enter your email"
          />
          {errors.email && (
            <span className="text-destructive text-xs">
              {errors.email.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <Label>Street Name and House Number*</Label>
          <Input
            {...register("address")}
            placeholder="Enter street name and house number"
          />
          {errors.address && (
            <span className="text-destructive text-xs">
              {errors.address.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label>
            City<span className="text-red-500">*</span>
          </Label>
          <Input {...register("city")} placeholder="Enter your city name" />
          {errors.city && (
            <span className="text-destructive text-xs">
              {errors.city.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label>
            Country of Residence<span className="text-red-500">*</span>
          </Label>
          <Input {...register("country")} placeholder="Select your country" />
          {errors.country && (
            <span className="text-destructive text-xs">
              {errors.country.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label>State (Optional)</Label>
          <Input {...register("state")} placeholder="Select your state" />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Phone Number*</Label>
          <Input {...register("phone")} placeholder="+970" />
          {errors.phone && (
            <span className="text-destructive text-xs">
              {errors.phone.message}
            </span>
          )}
        </div>
        <div className="md:col-span-2 flex flex-col gap-2">
          <Label>Gender</Label>
          <div className="flex items-center gap-2">
            {genderOptions?.map((genderOption: any) => (
              <button
                type="button"
                className={cn(
                  "w-full flex items-center border gap-1 rounded-lg px-4 py-3 text-[14px] text-left transition",
                  "border-gray-200 bg-white"
                )}
                onClick={() => {
                  setSelectedGender(genderOption.value);
                }}
              >
                {selectedGender === genderOption.value ? (
                  <CheckedIcon />
                ) : (
                  <UncheckedIcon />
                )}
                {genderOption.label}
              </button>
            ))}
          </div>
          {/* <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="male"
                {...register("gender")}
                defaultChecked
              />{" "}
              Male
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="female" {...register("gender")} />{" "}
              Female
            </label>
          </div> */}
        </div>
        <div className="md:col-span-2 flex flex-col gap-2">
          <Label>Identity Attachment [Id/Passport]</Label>

          <div
            className="border cursor-pointer rounded-lg border-gray-300 p-4 flex items-center gap-2 hover:bg-gray-50 transition"
            onClick={() => fileRef.current?.click()}
          >
            <UploadIcon width={90} />

            <span className="text-md text-muted-foreground">
              <span className="text-primary font-medium">
                Click to upload attachment
              </span>{" "}
              or drag and drop PNG, JPG or PDFs (Maximum 2 images or PDFs)
            </span>

            {/* Hidden file input */}
            <Input
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.pdf"
              {...register("identity")}
              className="hidden"
              ref={fileRef}
            />
          </div>
        </div>
      </div>
      {step === "partner" && (
        <div>
          <Separator className="my-8" />
          <div className="mt-8 mb-2 text-lg font-semibold">
            Business Details
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 md:col-span-2">
              <Label className="text-[14px]">
                Business Name<span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("businessName")}
                placeholder="Enter business name"
              />
              {errors.businessName && (
                <span className="text-destructive text-xs">
                  {errors.businessName.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <Label className="text-[14px]">
                Street Name and Number<span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("businessAddress")}
                placeholder="Enter street name and number"
              />
              {errors.businessAddress && (
                <span className="text-destructive text-xs">
                  {errors.businessAddress.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[14px]">
                City/Town<span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("businessCity")}
                placeholder="Enter city/town"
              />
              {errors.businessCity && (
                <span className="text-destructive text-xs">
                  {errors.businessCity.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[14px]">
                Country of the Business<span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("businessCountry")}
                placeholder="Select your country"
              />
              {errors.businessCountry && (
                <span className="text-destructive text-xs">
                  {errors.businessCountry.message}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      <div
        className="flex gap-4 mt-6 "
        style={{
          marginBottom: "20px",
        }}
      >
        <Button type="button" variant="outline" onClick={onBack}>
          CANCEL
        </Button>
        <Button type="submit" disabled={status === "pending"}>
          REGISTER
        </Button>
      </div>
      {error && (
        <div className="text-destructive text-sm mt-2">
          {(error as Error).message}
        </div>
      )}
    </form>
  );
};

export default RegisterForm;
