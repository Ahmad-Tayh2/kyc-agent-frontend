import { helpTableColumns } from "@/components/help/HelpTableColumns";
import { QuestionsTable } from "@/components/help/QuestionsTable";
import { DataTable } from "@/components/shared/DataTable";
import PageTitle from "@/components/shared/PageTitle";
import React from "react";
import { useTranslation } from "react-i18next";

const HelpPage: React.FC = () => {
  const { t } = useTranslation("global");
  const columns = helpTableColumns();
  const data: any = [
    {
      title: "Is there a free trial available?",
      description:
        "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
    },
    {
      title: "Can I change my plan later?",
      description:
        "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
    },
    {
      title: "What is your cancellation policy?",
      description:
        "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
    },
  ];
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <PageTitle title={t("modules.pages.help.title")} />
      </div>
      <div>
        <DataTable
          data={[]}
          columns={columns}
          tableTitle={"Consult Documentations"}
        />
      </div>
      <div>
        <QuestionsTable data={data} />
      </div>
    </div>
  );
};

export default HelpPage;
