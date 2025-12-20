import ActionButton from "@/components/shared/ActionButton";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useChangePassword } from "@/hooks/data/useAuth";
import { useState } from "react";
import { toast } from "sonner";

const ChangePasswordForm = () => {
  const { mutateAsync: changePassword, isPending } = useChangePassword();
  const [passwordState, setPasswordState] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [errors, setErrors] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // if(passwordState?.password && passwordState?.confirmPassword && )
    //should validate before submit (try using zod)
    const result = await changePassword(passwordState);
    if (result.status) {
      toast.success("Password changed successfully!");
      setErrors({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
      setPasswordState({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } else {
      setErrors(result?.errors);
    }
  };
  return (
    <form className="p-5 flex flex-col gap-5">
      <div className="flex flex-col gap-2 border-b-1 border-gray-200 pb-8">
        <Label>
          Old Password
          <span className="text-red-500">*</span>
        </Label>
        <PasswordInput
          value={passwordState?.current_password}
          onChange={(e: any) =>
            setPasswordState((prev: any) => ({
              ...prev,
              current_password: e.target.value,
            }))
          }
          disabled={isPending}
        />
        {errors?.current_password && (
          <span className="text-destructive text-xs">
            {errors?.current_password}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label>
          New Password
          <span className="text-red-500">*</span>
        </Label>
        <PasswordInput
          value={passwordState?.new_password}
          onChange={(e: any) =>
            setPasswordState((prev: any) => ({
              ...prev,
              new_password: e.target.value,
            }))
          }
          disabled={isPending}
        />
        {errors?.new_password && (
          <span className="text-destructive text-xs">
            {errors?.new_password}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label>
          Confirm New Password
          <span className="text-red-500">*</span>
        </Label>
        <PasswordInput
          value={passwordState?.new_password_confirmation}
          onChange={(e: any) =>
            setPasswordState((prev: any) => ({
              ...prev,
              new_password_confirmation: e.target.value,
            }))
          }
          disabled={isPending}
        />
        {errors?.new_password_confirmation && (
          <span className="text-destructive text-xs">
            {errors?.new_password_confirmation}
          </span>
        )}
      </div>
      <ActionButton
        title="Change Password"
        onClick={handleSubmit}
        disabled={isPending}
      />
    </form>
  );
};

export default ChangePasswordForm;
