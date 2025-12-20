import {
  useDetachAgentRecipients,
  useGetAgentRecipients,
} from "@/hooks/data/useAgent";
import { DataTable } from "../shared/DataTable";
import EditSectionCard from "../shared/EditSectionCard";
import { recipientsColumns } from "./RecipientsTableColumns";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import DetachRecipientDialog from "./DetachRecipientDialog";

const AgentCashRecipients = () => {
  const [openDetachPopup, setOpendetachPopup] = useState(false);
  const [recipientToDetachId, setRecipientToDetachId] = useState<
    null | string | number
  >(null);
  const columns = recipientsColumns(setOpendetachPopup, setRecipientToDetachId);
  const { user } = useAuthStore();
  const { data, isLoading, error } = useGetAgentRecipients(user?.agent?.id);
  const { mutateAsync: detachRecipientFromAgent } = useDetachAgentRecipients(
    user?.agent?.id!
  );

  const handleDetachConfirmation = async () => {
    await detachRecipientFromAgent(recipientToDetachId);
    setRecipientToDetachId(null);
  };
  return (
    <EditSectionCard sectionTitle="All Cash recipients">
      <div className="p-5 flex flex-col gap-5">
        <DataTable
          data={data?.data}
          columns={columns}
          isLoading={isLoading}
          error={error}
        />
        {openDetachPopup && (
          <DetachRecipientDialog
            isOpen={openDetachPopup}
            onClose={() => setOpendetachPopup(false)}
            onConfirm={handleDetachConfirmation}
          />
        )}
      </div>
    </EditSectionCard>
  );
};

export default AgentCashRecipients;
