import EditSectionCard from "@/components/shared/EditSectionCard";
import PageTitle from "@/components/shared/PageTitle";
import ChangePasswordForm from "@/components/userSettings/ChangePasswordForm";
import AgentCashRecipients from "@/components/userSettings/AgentCashRecipients";
import AgentBankAccountDetails from "@/components/userSettings/AgentBankAccountDetails";
import { cn } from "@/lib/utils";
import { useState, type ReactElement } from "react";
import ActionButton from "@/components/shared/ActionButton";
import { CirclePlus } from "lucide-react";
import CreateAgentBankAccountDialog from "@/components/userSettings/CreateAgentBankAccountDialog";

const UserSettingsPage = () => {
  const tabs = [
    {
      key: "security",
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
    {
      key: "bank",
      title: "Bank Account Details",
      content: <AgentBankAccountDetails />,
    },
    {
      key: "recipients",
      title: "My Cash Recipients",
      content: <AgentCashRecipients />,
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
  key: string;
  title: string;
  content: ReactElement;
}
interface TabNavigatorProps {
  tabs: Tab[];
}
const TabNavigator = (props: TabNavigatorProps) => {
  const { tabs } = props;
  const [selectedTab, setSelectedTab] = useState(0);
  const [openCreateBankDialog, setOpenCreateBankDialog] = useState(false);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center gap-5 border-b-1 border-gray-300">
        {tabs?.map((tab: Tab, index: number) => {
          return (
            <button
              onClick={() => setSelectedTab(index)}
              className={cn(
                "text-[20px] text-[#101828] font-400 border-b-3 border-transparent p-2 mt-auto",
                selectedTab === index && "border-primary"
              )}
            >
              {tab?.title}
            </button>
          );
        })}
        {tabs?.[selectedTab]?.key === "bank" && (
          <CreateAgentBankAccountDialog
            trigger={
              <ActionButton
                className="ml-auto mb-2"
                icon={
                  <CirclePlus size={50} fill="white" color="var(--primary)" />
                }
                title="ADD NEW BANK DETAILS"
              />
            }
            isOpen={openCreateBankDialog}
            setIsOpen={setOpenCreateBankDialog}
          />
        )}
      </div>
      <div>{tabs?.[selectedTab]?.content}</div>
    </div>
  );
};
