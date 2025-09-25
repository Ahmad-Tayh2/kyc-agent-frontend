import PageTitle from "@/components/shared/PageTitle";
import IssueConversation from "@/components/support/IssueConversation";
import IssueHeader from "@/components/support/IssueHeader";
import IssueSideDetails from "@/components/support/IssueSideDetails";
import { useTranslation } from "react-i18next";

export default function Issue() {
  const { t } = useTranslation("global");
  return (
    <div className="space-y-4 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <PageTitle title={t("modules.pages.support.title")} />
      </div>
      <div className="w-full h-full flex flex-col gap-1 border-1 border-gray-200 rounded-md overflow-hidden">
        <IssueHeader />
        <div className="flex h-full flex-1">
          <IssueSideDetails />
          <IssueConversation />
        </div>
      </div>
    </div>
  );
}
