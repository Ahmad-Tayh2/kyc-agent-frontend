import { useGetAgentBankAccount } from "@/hooks/data/useAgent";
// import EditSectionCard from "../shared/EditSectionCard";
import { useAuthStore } from "@/store/authStore";
import { useMemo } from "react";

const AgentBankAccountDetails = () => {
  //   const columns = recipientsColumns();
  const { user } = useAuthStore();
  const { data: bankAccountResponse } = useGetAgentBankAccount(user?.agent?.id);
  const bankAccountsData = useMemo(() => {
    return bankAccountResponse?.data ?? [];
  }, [bankAccountResponse]);
  if (!bankAccountsData?.length)
    return (
      <div className="bg-white p-5 rounded-md text-center">
        No data available.
      </div>
    );
  return (
    <div>
      {/* {bankAccountsData?.map((bankAccountData: any) => (
        <EditSectionCard sectionTitle="Bank name">
          <div className="p-5 flex flex-col gap-5">AgentBankAccountDetails</div>
        </EditSectionCard>
      ))} */}
    </div>
  );
};

export default AgentBankAccountDetails;
