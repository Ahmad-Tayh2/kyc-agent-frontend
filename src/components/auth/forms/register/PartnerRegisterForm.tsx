import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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

const PartnerRegisterForm: React.FC<{ onBack: () => void; onSubmit: (data: FormInputs) => void }> = ({ onBack, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
    // resolver: zodResolver(schema),
    defaultValues: { gender: "male" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      <button type="button" onClick={onBack} className="mb-2 text-primary">&larr; Back</button>
      <h1 className="text-2xl font-bold mb-2">Register As Business Partner</h1>
      <p className="mb-4">Required Details For Registration</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>First Name*</Label>
          <Input {...register("firstName")} placeholder="Enter your first name" />
          {errors.firstName && <span className="text-destructive text-xs">{errors.firstName.message}</span>}
        </div>
        <div>
          <Label>Last Name*</Label>
          <Input {...register("lastName")} placeholder="Enter your last name" />
          {errors.lastName && <span className="text-destructive text-xs">{errors.lastName.message}</span>}
        </div>
        <div>
          <Label>Date of Birth*</Label>
          <Input type="date" {...register("dob")} placeholder="DD/MM/YY" />
          {errors.dob && <span className="text-destructive text-xs">{errors.dob.message}</span>}
        </div>
        <div>
          <Label>Email*</Label>
          <Input type="email" {...register("email")} placeholder="Enter your email" />
          {errors.email && <span className="text-destructive text-xs">{errors.email.message}</span>}
        </div>
        <div className="md:col-span-2">
          <Label>Street Name and House Number*</Label>
          <Input {...register("address")} placeholder="Enter street name and house number" />
          {errors.address && <span className="text-destructive text-xs">{errors.address.message}</span>}
        </div>
        <div>
          <Label>City*</Label>
          <Input {...register("city")} placeholder="Enter your city name" />
          {errors.city && <span className="text-destructive text-xs">{errors.city.message}</span>}
        </div>
        <div>
          <Label>Country of Residence*</Label>
          <Input {...register("country")} placeholder="Select your country" />
          {errors.country && <span className="text-destructive text-xs">{errors.country.message}</span>}
        </div>
        <div>
          <Label>State (Optional)</Label>
          <Input {...register("state")} placeholder="Select your state" />
        </div>
        <div>
          <Label>Phone Number*</Label>
          <Input {...register("phone")} placeholder="+970" />
          {errors.phone && <span className="text-destructive text-xs">{errors.phone.message}</span>}
        </div>
        <div className="md:col-span-2">
          <Label>Gender</Label>
          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2">
              <input type="radio" value="male" {...register("gender")} defaultChecked /> Male
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="female" {...register("gender")} /> Female
            </label>
          </div>
        </div>
        <div className="md:col-span-2">
          <Label>Identity Attachment [Id/Passport]</Label>
          <Input type="file" multiple {...register("identity")} accept=".png,.jpg,.jpeg,.pdf" />
          <span className="text-xs text-muted-foreground">Click to upload attachment or drag and drop PNG, JPG or PDFs (Maximum 2 images or PDFs)</span>
        </div>
      </div>
      <div className="mt-8 mb-2 text-lg font-semibold">Business Details</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Business Name*</Label>
          <Input {...register("businessName")} placeholder="Enter business name" />
          {errors.businessName && <span className="text-destructive text-xs">{errors.businessName.message}</span>}
        </div>
        <div>
          <Label>Street Name and Number*</Label>
          <Input {...register("businessAddress")} placeholder="Enter street name and number" />
          {errors.businessAddress && <span className="text-destructive text-xs">{errors.businessAddress.message}</span>}
        </div>
        <div>
          <Label>City/Town*</Label>
          <Input {...register("businessCity")} placeholder="Enter city/town" />
          {errors.businessCity && <span className="text-destructive text-xs">{errors.businessCity.message}</span>}
        </div>
        <div>
          <Label>Country of the Business*</Label>
          <Input {...register("businessCountry")} placeholder="Select your country" />
          {errors.businessCountry && <span className="text-destructive text-xs">{errors.businessCountry.message}</span>}
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <Button type="button" variant="outline" onClick={onBack}>CANCEL</Button>
        <Button type="submit">REGISTER</Button>
      </div>
    </form>
  );
};

export default PartnerRegisterForm; 