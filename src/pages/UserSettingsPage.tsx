import EditSectionCard from "@/components/shared/EditSectionCard";
import PageTitle from "@/components/shared/PageTitle";
import { cn } from "@/lib/utils";
import { useState, type ReactElement } from "react";

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
    {
      title: "Bank Account Details",
      content: <div>test 2 </div>,
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
  return <form className="p-2">...</form>;
};
