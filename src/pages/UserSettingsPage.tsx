import ActionButton from "@/components/shared/ActionButton";
import EditSectionCard from "@/components/shared/EditSectionCard";
import PageTitle from "@/components/shared/PageTitle";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useChangePassword } from "@/hooks/data/useAuth";
import { cn } from "@/lib/utils";
import { useState, type ReactElement } from "react";
import { toast } from "sonner";

const UserSettingsPage = () => {
  const tabs = [
    {
      title: "Account Security",
      content: (
        <div className="flex gap-10">
          <EditSectionCard sectionTitle="Change Password" className="w-1/2">
            <ChangePasswordForm />
          </EditSectionCard>
          <EditSectionCard
            sectionTitle="Multi-Factor Authentication"
            description="Enhance your account security by enabling multi-factor authentication"
            className="w-1/2"
          >
            <div className="p-5">coming soon</div>
          </EditSectionCard>
        </div>
      ),
    },
  ];
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <PageTitle title="Settings" />
      </div>
      <TabNavigator tabs={tabs} />
    </div>
  );
};

export default UserSettingsPage;
interface Tab {
  title: string;
  content: ReactElement;
}
interface TabNavigatorProps {
  tabs: Tab[];
}
const TabNavigator = (props: TabNavigatorProps) => {
  const { tabs } = props;
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center gap-5 border-b-1 border-gray-300">
        {tabs?.map((tab: Tab, index: number) => {
          return (
            <button
              onClick={() => setSelectedTab(index)}
              className={cn(
                "text-[20px] text-[#101828] font-400 border-b-3 border-transparent p-2",
                selectedTab === index && "border-primary"
              )}
            >
              {tab?.title}
            </button>
          );
        })}
      </div>
      <div>{tabs?.[selectedTab]?.content}</div>
    </div>
  );
};

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
