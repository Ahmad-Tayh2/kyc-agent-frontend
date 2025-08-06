import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Share2 } from "lucide-react";

import PhoneInput from "@/components/shared/PhoneInput";
import { useCountries } from "@/hooks/data/useAddress";
import { useCreateCustomerForm } from "@/hooks/data/useCustomerForm";
import type { CreateCustomerFormRequest } from "@/types/customerForm/CreateCustomerFormRequest";
import type { Country } from "@/services/address";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import infoIcon from "@/assets/icons/info.svg";
import copyIcon from "@/assets/icons/clipboard.svg";

// Form validation schema
const customerFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional().or(z.literal("")),
  countryCode: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerFormSchema>;

interface CustomerFormDialogProps {
  trigger?: React.ReactNode;
  onSubmit?: (data: CustomerFormData) => Promise<void>;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CustomerFormDialog: React.FC<CustomerFormDialogProps> = ({
  trigger,
  onSubmit,
  isOpen,
  onOpenChange,
}) => {
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Fetch countries for phone input
  const { data: countries = [] } = useCountries();

  // Customer form creation hook
  const createCustomerFormMutation = useCreateCustomerForm();

  // Country phone code options
  const countryPhoneOptions = countries?.map((country: Country) => ({
    value: country.phone_code,
    label: country.name,
    code: country.phone_code,
    countryCode: country.iso2,
  }));

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      countryCode: "",
    },
  });

  const handleSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Parse phone number and country code from the phone input
      let countryPhoneCode = "";
      let phoneNumber = "";

      if (data.phone && data.countryCode) {
        countryPhoneCode = `+${data.countryCode}`;
        phoneNumber = data.phone
          .replace(`${data.countryCode} `, "")
          .replace(/^\+/, "");
      }

      // Transform dialog data to API format
      const apiData: CreateCustomerFormRequest = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        ...(countryPhoneCode && { country_phone_code: countryPhoneCode }),
        ...(phoneNumber && { phone_number: phoneNumber }),
      };

      // Create the customer form to get the link
      const result = await createCustomerFormMutation.mutateAsync(apiData);

      // Use the actual link from API response
      const link = result?.form_urls?.frontend_form_url;

      if (link) {
        setGeneratedLink(link);
        // Reset form fields automatically after successful link generation
        form.reset({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          countryCode: "",
        });
      } else {
        throw new Error("No form URL received from the API response");
      }

      // If there's a custom onSubmit handler, call it after successful creation
      if (onSubmit) {
        try {
          await onSubmit(data);
        } catch {
          // Handle custom onSubmit errors silently or add proper error handling
        }
      }
    } catch (error) {
      // Enhanced error handling for different error types
      if (error instanceof Error) {
        // Check if it's a network error
        if (
          error.message.includes("fetch") ||
          error.message.includes("network")
        ) {
          setErrorMessage(
            "Network error. Please check your internet connection and try again."
          );
        }
        // Check if it's a validation error (usually contains field names)
        else if (
          error.message.includes("email") ||
          error.message.includes("phone") ||
          error.message.includes("name")
        ) {
          setErrorMessage(`Validation error: ${error.message}`);
        }
        // Use the original error message for other cases
        else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch {
      // Failed to copy link - could add user feedback here
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Customer Form Link",
          text: "Please fill out this customer form",
          url: generatedLink,
        });
      } catch {
        // Error sharing - could add user feedback here
      }
    } else {
      // Fallback to copying to clipboard
      copyToClipboard(generatedLink);
    }
  };

  // Clear error message when user starts typing
  useEffect(() => {
    const subscription = form.watch(() => {
      if (errorMessage) {
        setErrorMessage("");
      }
    });
    return () => subscription.unsubscribe();
  }, [form, errorMessage]);

  // Reset dialog state when dialog closes
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      // Reset all state to initial values when dialog closes
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        countryCode: "",
      });
      setGeneratedLink("");
      setErrorMessage("");
      setIsSubmitting(false);
    }
    onOpenChange?.(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Generate New Link</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Generate Customer Form Link</DialogTitle>
          <DialogDescription>
            Create a personalized form link for your customer. This link will be
            sent to the customer to complete their registration.
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-3" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Error message display */}
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            {/* Success message display */}
            {generatedLink && !errorMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">
                  Link Generated Successfully!
                </h4>
                <p className="text-sm text-green-700">
                  The customer form link has been created and is ready to share.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="inline-flex items-start gap-2 bg-gray-100 px-2 py-1 rounded-md w-fit">
              <img
                src={infoIcon}
                alt="Info"
                className="w-4 h-4 mt-1 flex-shrink-0"
              />
              <p className="text-xs text-gray-600">
                This name is for you to identify the link for your customer.
                Your Customer can write his name via the link.
              </p>
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email address"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="inline-flex items-start gap-2 bg-gray-100 px-2 py-1 rounded-md w-fit">
              <img
                src={infoIcon}
                alt="Info"
                className="w-4 h-4 mt-1 flex-shrink-0"
              />
              <p className="text-xs text-gray-600">
                The link will be sent to the email address and you can copy it
              </p>
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Whatsapp Number (Optional)</FormLabel>
                  <FormControl>
                    <PhoneInput
                      placeholder="Enter phone number"
                      countryOptions={countryPhoneOptions || []}
                      selectedCountry={form.watch("countryCode")}
                      phoneNumber={field.value || ""}
                      onCountryChange={(countryCode) => {
                        form.setValue("countryCode", countryCode);
                        form.setValue("phone", "");
                      }}
                      onPhoneChange={(phoneNumber) =>
                        field.onChange(phoneNumber)
                      }
                      error={
                        form.formState.errors.countryCode?.message ||
                        form.formState.errors.phone?.message
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="sm:justify-between">
              <div className="flex items-center gap-2">
                {generatedLink && (
                  <>
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-md max-w-sm">
                      <span className="text-sm text-gray-600 truncate">
                        {generatedLink}
                      </span>
                    </div>{" "}
                    <Button
                      type="button"
                      size="sm"
                      variant={"outline"}
                      onClick={() => copyToClipboard(generatedLink)}
                      className="px-3"
                    >
                      <img
                        src={copyIcon}
                        alt="Copy"
                        className="w-5 h-5 text-gray-50"
                      />
                      <span className="ml-1">Copy</span>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={shareLink}
                      className="px-3"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </>
                )}
              </div>
              <Button
                type="submit"
                disabled={createCustomerFormMutation.isPending || isSubmitting}
              >
                {createCustomerFormMutation.isPending || isSubmitting
                  ? "Generating..."
                  : "Generate Link"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerFormDialog;
